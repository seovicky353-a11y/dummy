const { test, expect } = require('@playwright/test');
const { 
    productData, 
    updatedProductData, 
    partialUpdateData, 
    validUser, 
    invalidUser 
} = require('../testdata/productData');

test.describe('DummyJSON API Automation Assignment', () => {

    let createdProductId;
    let authToken;

    // 1. Get list of products
    test('1. Get list of products and verify response', async ({ request }) => {
        const response = await request.get('/products');
        expect(response.status()).toBe(200);

        const body = await response.json();
        expect(body.products).toBeDefined();
        expect(Array.isArray(body.products)).toBe(true);
        expect(body.products.length).toBeGreaterThan(0);
        console.log(`Retrieved ${body.products.length} products.`);
    });

    // 2. Get a particular product by ID
    test('2. Get a single product by ID and verify details', async ({ request }) => {
        const response = await request.get('/products/1');
        expect(response.status()).toBe(200);

        const body = await response.json();
        expect(body.id).toBe(1);
        expect(body.title).toBeDefined();
        expect(body.price).toBeDefined();
        expect(body.category).toBeDefined();
        expect(body.stock).toBeDefined();
        console.log(`Product 1 Name: ${body.title}, Stock: ${body.stock}`);
    });

    // 3. Create a new product using POJO test data
    test('3. Create a new product via API', async ({ request }) => {
        const response = await request.post('/products/add', {
            headers: { 'Content-Type': 'application/json' },
            data: productData
        });

        expect(response.status()).toBe(201);

        const body = await response.json();
        createdProductId = body.id; // Capture generated product ID
        console.log('Created Product ID:', createdProductId);

        expect(body.id).toBeDefined();
        expect(body.title).toBe(productData.title);
        expect(body.price).toBe(productData.price);
        expect(body.category).toBe(productData.category);
    });

    // 4. Update product title and price (PUT)
    test('4. Perform full update (PUT) on product', async ({ request }) => {
        const response = await request.put(`/products/${createdProductId || 1}`, {
            headers: { 'Content-Type': 'application/json' },
            data: updatedProductData
        });

        expect(response.status()).toBe(200);

        const body = await response.json();
        expect(body.title).toBe(updatedProductData.title);
        expect(body.price).toBe(updatedProductData.price);
        console.log('Full Update Output:', body);
    });

    // 5. Partial update price (PATCH)
    test('5. Perform partial update (PATCH) on product price', async ({ request }) => {
        const response = await request.patch(`/products/${createdProductId || 1}`, {
            headers: { 'Content-Type': 'application/json' },
            data: partialUpdateData
        });

        expect(response.status()).toBe(200);

        const body = await response.json();
        expect(body.price).toBe(partialUpdateData.price);
        console.log('Partial Update Output:', body);
    });

    // 6. Delete created product
    test('6. Delete the created product', async ({ request }) => {
        const response = await request.delete(`/products/${createdProductId || 1}`);
        expect(response.status()).toBe(200);

        const body = await response.json();
        expect(body.isDeleted).toBe(true);
        console.log('Deleted Product Details:', body);
    });

    // 7. Login API test and capture token
    test('7. Login API with valid credentials', async ({ request }) => {
        const response = await request.post('/auth/login', {
            headers: { 'Content-Type': 'application/json' },
            data: validUser
        });

        expect(response.status()).toBe(200);

        const body = await response.json();
        expect(body.accessToken).toBeDefined();
        authToken = body.accessToken; // Store token for next request
        console.log('Captured Auth Token:', authToken.substring(0, 20) + '...');
    });

    // 8. Call authenticated user API using token
    test('8. Fetch user details with Auth Token', async ({ request }) => {
        const response = await request.get('/auth/me', {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        expect(response.status()).toBe(200);

        const body = await response.json();
        expect(body.username).toBe(validUser.username);
        console.log(`Authenticated as User: ${body.firstName} ${body.lastName}`);
    });

    // --- NEGATIVE TEST SCENARIOS ---

    // 9. Negative Scenario: Invalid Product ID
    test('9. Negative: Fetch product with invalid ID', async ({ request }) => {
        const response = await request.get('/products/9999999');
        expect(response.status()).toBe(404);

        const body = await response.json();
        expect(body.message).toBeDefined();
        console.log('Invalid Product Error Message:', body.message);
    });

    // 10. Negative Scenario: Invalid Login Credentials
    test('10. Negative: Login with invalid credentials', async ({ request }) => {
        const response = await request.post('/auth/login', {
            headers: { 'Content-Type': 'application/json' },
            data: invalidUser
        });

        expect(response.status()).toBe(400);

        const body = await response.json();
        expect(body.message).toBeDefined();
        console.log('Invalid Login Error Message:', body.message);
    });

    // 11. Negative Scenario: Authenticated API call without token
    test('11. Negative: Call authenticated API without token', async ({ request }) => {
        const response = await request.get('/auth/me');
        // DummyJSON returns 401 Unauthorized when missing token
        expect(response.status()).toBe(401);

        const body = await response.json();
        console.log('Unauthenticated Error Message:', body.message);
    });
});