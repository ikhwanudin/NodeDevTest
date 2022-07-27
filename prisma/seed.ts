import { PrismaClient, Prisma } from "@prisma/client";

const client = new PrismaClient()

async function seed() {

    let images: Prisma.ImageCreateInput[] = [
        {
            path: 'test.png'
        },
        {
            path: 'seed.png'
        },
    ]

    await Promise.all(
        images.map(async (user) => {
            await client.image.create({
                data: user,
            })
        })
    )
}

seed()