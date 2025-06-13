import { NextRequest, NextResponse } from "next/server";
import { JSDOM } from "jsdom";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; Euro-Hackathons-Bot)",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    const dom = new JSDOM(html);
    const document = dom.window.document;

    // Estrai metadati Open Graph
    const getMetaContent = (property: string) => {
      const meta =
        document.querySelector(`meta[property="${property}"]`) ||
        document.querySelector(`meta[name="${property}"]`);
      return meta?.getAttribute("content") || null;
    };

    const preview = {
      title:
        getMetaContent("og:title") ||
        document.querySelector("title")?.textContent ||
        null,
      description:
        getMetaContent("og:description") ||
        getMetaContent("description") ||
        null,
      image:
        getMetaContent("og:image") || getMetaContent("twitter:image") || null,
      siteName: getMetaContent("og:site_name") || null,
    };

    return NextResponse.json(preview);
  } catch (error) {
    console.error("Error fetching preview:", error);
    return NextResponse.json(
      { error: "Failed to fetch preview" },
      { status: 500 },
    );
  }
}
