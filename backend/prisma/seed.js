import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Clear existing data
  await prisma.paymentResult.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.cartItem.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.user.deleteMany({});

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  // Create regular user
  const userPassword = await bcrypt.hash('user123', 10);
  const user = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      password: userPassword,
      phone: '+1 555-123-4567',
      address: '123 Main St, Anytown, USA',
    },
  });

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Clothing',
        description: 'Stylish clothing for all occasions',
        image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Shoes',
        description: 'Footwear for every style',
        image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Accessories',
        description: 'Elevate your look with our accessories',
        image: 'https://images.unsplash.com/photo-1611923134239-2cbe9b54335c',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Beauty',
        description: 'Premium beauty products',
        image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348',
      },
    }),
  ]);

  // Create products
  const products = await Promise.all([
    // Clothing products
    prisma.product.create({
      data: {
        name: 'Premium Cotton T-Shirt',
        description: 'Soft, breathable cotton t-shirt with a modern fit.',
        price: 29.99,
        salePrice: 24.99,
        images: [
          'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
          'https://images.unsplash.com/photo-1503341504253-dff4815485f1',
        ],
        brand: 'Luxe Basics',
        inventory: 100,
        featured: true,
        bestSeller: true,
        category: { connect: { name: 'Clothing' } },
      },
    }),
    prisma.product.create({
      data: {
        name: 'Slim Fit Jeans',
        description: 'Modern slim fit jeans with stretch comfort.',
        price: 79.99,
        images: [
          'https://images.unsplash.com/photo-1582552938357-32b906df40cb',
          'https://images.unsplash.com/photo-1541099649105-f69ad21f3246',
        ],
        brand: 'Luxe Denim',
        inventory: 75,
        featured: true,
        category: { connect: { name: 'Clothing' } },
      },
    }),
    // Shoes products
    prisma.product.create({
      data: {
        name: 'Classic Leather Sneakers',
        description: 'Timeless leather sneakers that go with everything.',
        price: 119.99,
        salePrice: 99.99,
        images: [
          'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77',
          'https://images.unsplash.com/photo-1560769629-975ec94e6a86',
        ],
        brand: 'Luxe Footwear',
        inventory: 50,
        newArrival: true,
        category: { connect: { name: 'Shoes' } },
      },
    }),
    // Accessories products
    prisma.product.create({
      data: {
        name: 'Minimalist Watch',
        description: 'Elegant timepiece with a minimalist design.',
        price: 149.99,
        images: [
          'https://images.unsplash.com/photo-1524805444758-089113d48a6d',
          'https://images.unsplash.com/photo-1622434641406-a158123450f9',
        ],
        brand: 'Luxe Time',
        inventory: 30,
        bestSeller: true,
        category: { connect: { name: 'Accessories' } },
      },
    }),
    // Beauty products
    prisma.product.create({
      data: {
        name: 'Hydrating Face Serum',
        description: 'Intensely hydrating serum for all skin types.',
        price: 59.99,
        salePrice: 49.99,
        images: [
          'https://images.unsplash.com/photo-1596462502278-27bfdc403348',
          'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908',
        ],
        brand: 'Luxe Beauty',
        inventory: 60,
        featured: true,
        newArrival: true,
        category: { connect: { name: 'Beauty' } },
      },
    }),
  ]);

  // Add reviews
  await prisma.review.create({
    data: {
      rating: 5,
      comment: 'This is the best product I have ever used!',
      user: { connect: { id: user.id } },
      product: { connect: { id: products[0].id } },
    },
  });

  await prisma.review.create({
    data: {
      rating: 4,
      comment: 'Really nice quality and fast shipping.',
      user: { connect: { id: user.id } },
      product: { connect: { id: products[2].id } },
    },
  });

  // Update product ratings
  await prisma.product.update({
    where: { id: products[0].id },
    data: { rating: 5, numReviews: 1 },
  });

  await prisma.product.update({
    where: { id: products[2].id },
    data: { rating: 4, numReviews: 1 },
  });

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 