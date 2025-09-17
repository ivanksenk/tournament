import { PrismaService } from "prisma/prisma.service";
const prisma = new PrismaService();
const users = [
    {
        email: 'tony@stark.com',
        username: 'tonystark'
    },
    {
        email: 'thor@odinson.com',
        username: 'thorodinson'
    },
    {
        email: 'brucebanner@marvel.com',
        username: 'brucebanner'
    },
    {
        email: 'stevenrogers@marvel.com',
        username: 'stevenrogers'
    },
    {
        email: 'lokiodinson@odinson.com',
        username: 'lokiodinson'
    }
]

const tournaments = [
    {
        name: "Турнир за звание лучшего Мстителя",
        description: "Имени Джона Ленона",
        startDate: new Date().toISOString()
    }
]

async function main() {
    await prisma.user.deleteMany();
    await prisma.tournament.deleteMany();
    await prisma.tournamentParticipation.deleteMany();
    await prisma.user.createMany({ data: users });
    await prisma.tournament.createMany({data:tournaments});
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect();
        console.log('Seeds upload')
    })