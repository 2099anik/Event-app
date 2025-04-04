import {connectiostr} from "@/lib/db";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Product from "@/lib/model/product";

export default async function GET() {
    await mongoose.connect(connectiostr);
    const data=await Product.find();
    console.log(data);
    return NextResponse.json(data);
}