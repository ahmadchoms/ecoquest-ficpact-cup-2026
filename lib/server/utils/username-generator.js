export function generateUsername(fullName) {
  if (!fullName || typeof fullName !== 'string') {
    throw new Error('Nama harus berupa string dan tidak boleh kosong');
  }

  // Hapus spasi dan ubah ke lowercase
  const baseUsername = fullName
    .trim()
    .replace(/\s+/g, '') // Hapus semua whitespace
    .toLowerCase()
    .replace(/[^a-z0-9]/g, ''); // Hapus karakter khusus

  if (baseUsername.length === 0) {
    throw new Error('Nama harus mengandung minimal satu karakter alfanumerik');
  }

  // Generate 4 digit random
  const randomDigits = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0');

  return `${baseUsername}${randomDigits}`;
}

export async function generateUniqueUsername(fullName, checkFunction) {
  let username = generateUsername(fullName);
  let attempts = 0;
  const maxAttempts = 10;

  // Jika ada function untuk cek, gunakan untuk memastikan unique
  if (checkFunction && typeof checkFunction === 'function') {
    while (attempts < maxAttempts) {
      const exists = await checkFunction(username);
      if (!exists) {
        return username;
      }
      // Jika sudah ada, generate ulang
      username = generateUsername(fullName);
      attempts++;
    }
    throw new Error('Gagal membuat username yang unik setelah ' + maxAttempts + ' percobaan');
  }

  return username;
}
