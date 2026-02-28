# Analisa Folder app/api - EcoQuest

**Tanggal Analisis:** 28 February 2026

---

## 📋 Struktur API

```
app/api/
└── admin/
    ├── activities/route.js
    ├── badges/
    │   ├── route.js
    │   └── [id]/route.js
    ├── missions/
    │   ├── route.js
    │   └── [id]/route.js
    ├── provinces/
    │   ├── route.js
    │   └── [id]/route.js
    ├── stats/route.js
    ├── users/
    │   ├── route.js
    │   └── [id]/route.js
    └── (10 file total)
```

---

## 🔧 Teknologi & Library yang Digunakan

| Library | Penggunaan |
|---------|-----------|
| **Next.js** | App Router dengan file `route.js` |
| **NextResponse** | API Response handling |
| **Prisma ORM** | Query database dan management |
| **Zod** | Schema validation (`adminBadgeSchema`, `paginationSchema`, dll) |
| **URL API** | Parse query parameters |

---

## ✅ Fungsi-Fungsi API

### 1. **Activities API** (`/api/admin/activities`)
- **GET** - Mengambil 5 aktivitas terbaru dengan data user dan mission
- **Methods:** GET saja
- **Response:** Array aktivitas dengan format: `id`, `user_id`, `username`, `action`, `timestamp`, `type`, `xp_earned`, `mission_category`

---

### 2. **Badges API** (`/api/admin/badges`)
- **GET** - List badges dengan pagination dan filter
  - Query params: `page`, `limit`, `search`, `rarity`, `category`
  - Response: Badges array + metadata (total, page, limit, totalPages)
- **POST** - Create badge baru
  - Body validation: `adminBadgeSchema`
  - Status: 201 (Created)
- **PATCH** (by ID) - Update badge
  - Partial update support
- **DELETE** (by ID) - Hapus badge
- **Include count:** Menampilkan berapa users yang punya badge tersebut

---

### 3. **Missions API** (`/api/admin/missions`)
- **GET** - List missions dengan pagination dan filter
  - Query params: `page`, `limit`, `search`, `status`, `difficulty`, `category`
  - Include: province, badgeReward, _count.completions
- **POST** - Create mission
  - Body validation: `adminMissionSchema`
- **PATCH** (by ID) - Update mission
- **DELETE** (by ID) - Hapus mission
- **Include relationships:** province, badgeReward, completions count

---

### 4. **Provinces API** (`/api/admin/provinces`)
- **GET** - List provinces dengan pagination
  - Query params: `page`, `limit`, `search`, `threatLevel`
  - Transform: Convert `_count.missions` ke `missionsCount`
- **POST** - Create province
  - Validation: `adminProvinceSchema`
- **PATCH** (by ID) - Update province
- **DELETE** (by ID) - Hapus province

---

### 5. **Stats API** (`/api/admin/stats`)
- **GET** - Dashboard statistics
  - Total users
  - Active missions
  - Active provinces
  - Total completions
  - Completion rate (%)
  - XP awarded today
  - Pending missions count
- **Aggregation:** Menggunakan `aggregate()` untuk XP calculation

---

### 6. **Users API** (`/api/admin/users`)
- **GET** - List users dengan pagination dan filter
  - Query params: `page`, `limit`, `search`, `role`, `status`
  - Select fields: Limited selection (exclude password)
- **POST** - Create user baru
  - Validation: `adminUserSchema`
- **PATCH** (by ID) - Update user
  - Partial update
  - Password update support
- **DELETE** (by ID) - Delete user
- **Include:** Badges user (for detail endpoint)

---

## 🔴 KESALAHAN & ISSUE DITEMUKAN

### **CRITICAL ISSUES**

#### 1. **Password Tidak Di-Hash (SECURITY RISK)** ⚠️ **CRITICAL**
**File:** `/api/admin/users/route.js` (POST endpoint)

```javascript
// ❌ SALAH - Password disimpan plain text
const password = parsedData.data.password || "defaultpassword123";

const newUser = await prisma.user.create({
  data: {
    password: password, // In production ALWAYS hash ← Komentar ini IRONIS
    // ...
  }
});
```

**Problem:**
- Password disimpan sebagai plain text di database
- Sangat berbahaya jika database di-hack
- Ada comment "In production ALWAYS hash" tapi tidak diimplementasi

**Solusi:**
```javascript
import bcrypt from 'bcryptjs';

const hashedPassword = await bcrypt.hash(password, 10);

const newUser = await prisma.user.create({
  data: {
    password: hashedPassword,
    // ...
  }
});
```

---

#### 2. **Tidak Ada Authentication/Authorization Check** ⚠️ **CRITICAL**
**File:** Semua endpoint di `/api/admin/*`

**Problem:**
- Tidak ada fungsi untuk verify apakah user adalah admin
- Tidak ada JWT token verification
- Tidak ada session check
- Siapa saja bisa akses semua admin endpoints!

**Contoh Issue:**
```javascript
export async function GET(request) {
  // ❌ LANGSUNG RETURN DATA TANPA CEK SIAPA YANG REQUEST
  const badges = await prisma.badge.findMany({...});
  return NextResponse.json({...});
}
```

**Solusi:**
```javascript
import { verifyAdminAuth } from "@/lib/auth";

export async function GET(request) {
  // ✅ Verify admin terlebih dahulu
  const user = await verifyAdminAuth(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  // Lanjut ke query...
}
```

---

#### 3. **Default Password Hardcoded** ⚠️ **SECURITY RISK**
**File:** `/api/admin/users/route.js`

```javascript
const password = parsedData.data.password || "defaultpassword123"; // ❌ BAHAYA
```

**Problem:**
- Ada default password yang bisa di-tebak
- User baru akan punya password yang sama jika tidak diberikan password

---

### **HIGH PRIORITY ISSUES**

#### 4. **Tidak Ada Validation Error Detail** ⚠️ **HIGH**
**File:** Beberapa endpoint

**Problem:**
- Response error hanya return `parsedData.error.errors` dari Zod
- Array error details bisa membingungkan client
- Tidak ada format error yang konsisten

**Current:**
```javascript
if (!parsedParams.success) {
  return NextResponse.json({ 
    success: false, 
    error: parsedParams.error.errors  // ❌ Format tidak konsisten
  }, { status: 400 });
}
```

---

#### 5. **Tidak Ada Rate Limiting** ⚠️ **HIGH**
**File:** Semua endpoint

**Problem:**
- Bisa di-exploit untuk brute force
- Tidak ada protection terhadap DDoS
- Bisa membanjiri database dengan queries

---

#### 6. **Risiko N+1 Query Masih Ada** ⚠️ **MEDIUM**
**File:** `/api/admin/missions/route.js` dan missions/[id]/route.js

```javascript
// Kalau ada 100 missions, akan query province 100x
missions.map(m => ({
  province: m.province // ← N+1 risk kalau relationship not included properly
}));
```

---

#### 7. **Tidak Ada Query Logging/Monitoring** ⚠️ **MEDIUM**
**File:** Semua file

**Problem:**
- Hanya ada `console.error` saat error
- Tidak ada tracking untuk successful queries
- Sulit untuk debugging performance issues

---

### **MEDIUM PRIORITY ISSUES**

#### 8. **Inconsistent Error Messages** ⚠️ **MEDIUM**
**File:** Berbagai endpoint

```javascript
// Tidak konsisten antara satu endpoint dengan yang lain
"Gagal memuat lencana."  // Badges
"Gagal memuat misi."      // Missions
"Telah terjadi kesalahan saat memuat data statistik." // Stats
```

---

#### 9. **Magic Numbers & Strings** ⚠️ **MEDIUM**
**File:** `/api/admin/activities/route.js`

```javascript
const defaultLimit = 5;  // ❌ Magic number, should be constant

// Di badges:
if (query.rarity && query.rarity !== "ALL") // ❌ "ALL" hardcoded
if (query.category && query.category !== "ALL")
```

---

#### 10. **Tidak Ada Request Body Size Limit** ⚠️ **MEDIUM**
**File:** Semua POST/PATCH endpoints

**Problem:**
- User bisa send payload sangat besar
- Bisa crash server atau memory overflow
- Tidak ada size validation

---

#### 11. **Cascading Delete Tidak Di-Handle** ⚠️ **MEDIUM**
**File:** `/api/admin/missions/[id]/route.js`, `/api/admin/badges/[id]/route.js`

```javascript
export async function DELETE(request, { params }) {
  const id = params.id;
  await prisma.mission.delete({ where: { id } });
  // ❌ Apa yang terjadi dengan mission completions?
  // ❌ Apa yang terjadi dengan user badges?
}
```

---

#### 12. **Tidak Ada Pagination Validation** ⚠️ **MEDIUM**
**File:** Semua GET list endpoints

**Problem:**
- Kalau user request `page=999999`, akan query database
- Tidak ada max limit untuk `limit` parameter
- User bisa request million records

---

#### 13. **Inconsistent Select Fields** ⚠️ **LOW**
**File:** `/api/admin/users/route.js`

```javascript
// GET list: Select limited fields
select: {
  id: true,
  username: true,
  email: true,
  role: true,
  status: true,
  level: true,
  xp: true,
  profileImage: true,
  createdAt: true,
}

// POST response: Select different fields
select: {
  id: true,
  username: true,
  email: true,
  role: true,
  status: true,
}
// ❌ Inconsistent, should return same fields
```

---

## 📊 Tabel Ringkasan Issue

| No | Issue | Severity | File | Solusi |
|----|----|----------|------|--------|
| 1 | Password Plain Text | CRITICAL | users/route.js | Hash dengan bcrypt |
| 2 | Tidak Ada Auth Check | CRITICAL | semua admin/* | Add middleware auth |
| 3 | Default Hardcoded Password | HIGH | users/route.js | Random temp password |
| 4 | Validation Error Format | HIGH | semua GET | Standardize error response |
| 5 | Tidak Ada Rate Limiting | HIGH | semua endpoint | Add rate limiter |
| 6 | N+1 Query Risk | MEDIUM | missions/* | Verify include relationships |
| 7 | Tidak Ada Query Logging | MEDIUM | semua | Add comprehensive logging |
| 8 | Inconsistent Error Messages | MEDIUM | semua | Create error constant |
| 9 | Magic Numbers | MEDIUM | activities/route.js | Create constants file |
| 10 | No Request Size Limit | MEDIUM | semua POST/PATCH | Add middleware |
| 11 | Cascading Delete | MEDIUM | badges/[id], missions/[id] | Add cascade handling |
| 12 | No Pagination Validation | MEDIUM | semua GET | Add max limit |
| 13 | Inconsistent Select Fields | LOW | users/route.js | Standardize response |

---

## ✨ Best Practices Yang Sudah Diterapkan

1. ✅ **Menggunakan Prisma ORM** - Proper database management
2. ✅ **Input Validation dengan Zod** - Validation schema yang baik
3. ✅ **Error Handling** - Try-catch blocks di semua endpoints
4. ✅ **HTTP Status Codes** - Proper status codes (201, 404, 409, 500)
5. ✅ **Pagination Support** - `page` dan `limit` implementation
6. ✅ **Search Functionality** - Full-text search dengan case-insensitive
7. ✅ **Relationship Handling** - Include relationships in queries
8. ✅ **Count Transformation** - Convert `_count` ke readable format
9. ✅ **Partial Updates** - `.partial()` untuk PATCH endpoints
10. ✅ **Duplicate Key Handling** - Check `P2002` error code

---

## 📝 Response Format Standard

Semua endpoints mengikuti format respons yang konsisten:

```javascript
// Success Response
{
  success: true,
  data: {...} atau [...],
  meta: { total, page, limit, totalPages } // untuk list endpoints
}

// Error Response
{
  success: false,
  error: "Error message"
}

// Status Codes
- 200: OK (GET, PATCH)
- 201: Created (POST)
- 400: Bad Request (validation fail)
- 404: Not Found
- 409: Conflict (duplicate key)
- 500: Server Error
```

---

## 🔐 Rekomendasi Action Items

### Priority 1 (Urgent - Do First)
1. ✋ **Hash Password** - Implement bcrypt immediately
2. ✋ **Add Authentication Middleware** - Verify admin status
3. ✋ **Remove Default Password** - Use secure temp password

### Priority 2 (Important - Do Soon)
4. Add Rate Limiting middleware
5. Add Request Size validation
6. Standardize error responses
7. Add comprehensive logging

### Priority 3 (Nice to Have - Do Later)
8. Add pagination max limits
9. Create api/constants.js untuk magic numbers
10. Add query performance monitoring
11. Add API documentation with OpenAPI/Swagger

---

## 📚 Struktur Validasi Schema

Digunakan dari `/lib/validations/admin.js`:

- `adminBadgeSchema` - Badge validation
- `adminMissionSchema` - Mission validation
- `adminProvinceSchema` - Province validation
- `adminUserSchema` - User validation
- `paginationSchema` - Pagination validation

*(Semua menggunakan Zod)*

---

## 🗂️ File Dependencies

```
app/api/admin/
├── Uses: /lib/prisma.js (Database)
├── Uses: /lib/validations/admin.js (Schemas)
├── Uses: NextResponse from next/server
└── Uses: Prisma Client
```

---

## 📌 Catatan Penting

1. **Session/Auth:** Tidak ada session atau JWT token verification di endpoints
2. **Logging:** Hanya error yang di-log, success queries tidak
3. **Database:** Menggunakan Prisma dengan connection pooling
4. **Next.js Version:** Menggunakan App Router (Route Handlers di app/api/)
5. **Timezone:** Date calculation untuk XP today bisa berbeda timezone

---

**End of Analysis Document**
Generated: 28 February 2026
