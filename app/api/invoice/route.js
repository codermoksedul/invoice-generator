import { connectMongoDB } from "@/lib/mongodb";
import Invoice from "@/models/invoice";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const invoiceData = await req.json();
    await connectMongoDB();
    const newInvoice = new Invoice(invoiceData);
    await newInvoice.save();
    return NextResponse.json({ message: "Invoice inserted successfully." }, { status: 201 });
  } catch (error) {
    console.error("Error inserting invoice:", error);
    return NextResponse.json({ message: "An error occurred while inserting the invoice." }, { status: 500 });
  }
}
