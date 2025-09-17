import Product from "@/models/Product";

export async function GET() {
  return Response.json(await Product.find()); // Product.find() returns all products no filtered
}

export async function POST(request) {
  const body = await request.json(); // await is wait for all data to be fetched before moving to next line
  console.log(body)
  const product = new Product(body);
  await product.save(); // save to database(MongoDB)
  return Response.json(product); // return the saved product as JSON response
}

export async function PUT(request) {
  const body = await request.json();
  const { _id, ...updateData } = body;
  const product = await Product.findByIdAndUpdate(_id, updateData, { new: true });
  if (!product) {
    return new Response("Product not found", { status: 404 });
  }
  return Response.json(product);
}

export async function PATCH(request) {
  const body = await request.json();
  const { _id, ...updateData } = body;
  const product = await Product.findByIdAndUpdate(_id, updateData, { new: true });
  if (!product) {
    return new Response("Product not found", { status: 404 });
  }
  return Response.json(product);
}