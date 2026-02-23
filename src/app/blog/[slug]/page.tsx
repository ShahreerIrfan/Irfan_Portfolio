import { Metadata } from "next";
import connectDB from "@/lib/mongodb";
import Blog from "@/models/Blog";
import BlogPostClient from "./BlogPostClient";

export const dynamic = 'force-dynamic';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://irfan-portfolio-dun.vercel.app";

async function getBlog(slug: string) {
  await connectDB();
  const blog = await Blog.findOneAndUpdate(
    { slug, published: true },
    { $inc: { views: 1 } },
    { new: true }
  ).lean();
  return blog ? JSON.parse(JSON.stringify(blog)) : null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  await connectDB();
  const blog = await Blog.findOne({ slug, published: true }).lean();

  if (!blog) {
    return { title: "Blog Post Not Found" };
  }

  const b: any = blog;
  const title = b.title;
  const description = b.excerpt || b.title;
  const image = b.coverImage || `${siteUrl}/og-default.png`;
  const url = `${siteUrl}/blog/${slug}`;

  return {
    title,
    description,
    openGraph: {
      type: "article",
      title,
      description,
      url,
      siteName: "Irfan's Portfolio",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      publishedTime: b.createdAt,
      modifiedTime: b.updatedAt,
      authors: [b.author || "Irfan"],
      tags: b.tags || [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
          <p className="text-gray-400 mb-6">The blog post you are looking for does not exist.</p>
          <a href="/blog" className="text-blue-400 hover:underline">Back to Blog</a>
        </div>
      </div>
    );
  }

  return <BlogPostClient blog={blog} />;
}