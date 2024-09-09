import { PrismaClient } from '@prisma/client';
import { fieldEncryptionExtension } from 'prisma-field-encryption';

const prismaClientSingleton = () => {
  const globalClient = new PrismaClient();
  
  // Apply the field encryption extension
  return globalClient.$extends(
    fieldEncryptionExtension()
  );
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;
