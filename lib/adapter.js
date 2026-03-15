import prisma from "./prisma";

export function PrismaAdapterCustom(p) {
  return {
    async createUser(data) {
      const { emailVerified, ...userDataWithoutVerified } = data;
      return p.user.create({
        data: userDataWithoutVerified,
      });
    },

    async getUser(id) {
      return p.user.findUnique({
        where: { id },
      });
    },

    async getUserByEmail(email) {
      return p.user.findUnique({
        where: { email },
      });
    },

    async getUserByAccount({ providerAccountId, provider }) {
      const account = await p.account.findUnique({
        where: {
          provider_providerAccountId: {
            provider,
            providerAccountId,
          },
        },
        select: { user: true },
      });
      return account?.user ?? null;
    },

    async updateUser(data) {
      const { emailVerified, ...userDataWithoutVerified } = data;
      return p.user.update({
        where: { id: data.id },
        data: userDataWithoutVerified,
      });
    },

    async deleteUser(id) {
      return p.user.delete({
        where: { id },
      });
    },

    async linkAccount(data) {
      return p.account.create({
        data,
      });
    },

    async unlinkAccount({ providerAccountId, provider }) {
      return p.account.delete({
        where: {
          provider_providerAccountId: {
            provider,
            providerAccountId,
          },
        },
      });
    },

    async createSession(data) {
      return p.session.create({
        data,
      });
    },

    async getSessionAndUser(sessionToken) {
      const session = await p.session.findUnique({
        where: { sessionToken },
        include: { user: true },
      });
      return session ? { session, user: session.user } : null;
    },

    async updateSession(data) {
      return p.session.update({
        where: { sessionToken: data.sessionToken },
        data,
      });
    },

    async deleteSession(sessionToken) {
      return p.session.delete({
        where: { sessionToken },
      });
    },

    async createVerificationToken(data) {
      return p.verificationToken.create({
        data,
      });
    },

    async useVerificationToken({ identifier, token }) {
      return p.verificationToken.delete({
        where: {
          identifier_token: {
            identifier,
            token,
          },
        },
      });
    },
  };
}
