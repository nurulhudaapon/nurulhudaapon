import { saveAs } from "file-saver";
import { gfm } from "joplin-turndown-plugin-gfm";
import JSZip from "jszip";
import Head from "next/head";
import Papa from "papaparse";
import { ChangeEventHandler, useState } from "react";
import Turndown from "turndown";
import styles from "../styles/Home.module.css";

const toSlug = (str: string) =>
  str
    ?.toLowerCase()
    ?.split(" ")
    ?.join("-")
    ?.replace(/[^a-z^\-]/g, "");

async function getFileFromUrl(url, name, defaultType = "image/jpeg") {
  const response = await fetch(url);
  const data = await response.blob();
  return new File([data], name, {
    type: response.headers.get("content-type") || defaultType,
  });
}

async function processHtmlImage(html: string, zip: JSZip, categoryPath: string, titleSlug: string) {
  var doc = new DOMParser().parseFromString(html, "text/xml");
  doc.querySelectorAll("img").forEach(async (imgEl, i) => {
    try {
      const file = await getFileFromUrl(imgEl.getAttribute("src"), titleSlug + "-" + i);
      zip.file("static/img/" + categoryPath, file);
      imgEl.src = "static/img/" + categoryPath;
      console.log(file);
    } catch (error) {
      console.log(error);
    }
  });
  return html;
}

const md = new Turndown({});
md.use(gfm);
md.addRule("removenon", {
  filter: ["head", "meta"],
  replacement: function (content) {
    return "`" + content + "`";
  },
});

md.addRule("precode", {
  filter: "pre",
  replacement: function (content) {
    return "\n```\n" + content + "\n```\n";
  },
});

const complete = async (result, setLoading) => {
  const [headers, ...data] = result?.data;
  const categories: Record<string, string> = {};
  const zip = new JSZip();
  const filteredData: [] = data?.filter((i) => i[9]);

  filteredData.forEach((value) => {
    let htmlContent = value[4];
    if (!htmlContent) return;

    const title = value[0] as string;
    const category = (value[5] as string) || "Drafts";
    const subCategory = value[6] as string;
    const isDraft = value[9] === "DRAFT";

    const docMeta = `---
title: "${title}"
archived: ${value[10]}
status: ${value[9]}
hide_title: ${isDraft}
description: ${value[7] ? value[7] : `"${title}"`}
---

`;

    const titleSlug = toSlug(title);
    const categorySlug = toSlug(category);
    const subCategorySlug = toSlug(subCategory);

    const categoryPath = `${categorySlug}${subCategorySlug ? "/" + subCategorySlug : ""}`;
    if (!categories[categoryPath] && categoryPath) {
      zip.file("docs/" + categoryPath + "/" + "_category_.json", JSON.stringify({ label: subCategory || category }));
      categories[categoryPath] = subCategorySlug || category;
    }
    const path = `docs/${categoryPath}/${titleSlug}.md`;
    try {
      // await processHtmlImage(htmlContent, zip, categoryPath, titleSlug);
    } catch (error) {
      console.error("Error processing html image", error);
    }
    const fileContent = docMeta + md.turndown(htmlContent);
    zip.file(path, fileContent);
  });

  zip.generateAsync({ type: "blob" }).then((blob) => {
    saveAs(blob, "docusaurus.zip");
    setLoading(false);
  });
};

export default function Home() {
  const [loading, setLoading] = useState(false);
  const handleFileSelect: ChangeEventHandler<HTMLInputElement> = async (event) => {
    setLoading(true);
    const file = event.target.files[0];
    processFile(file, setLoading);
  };
  return (
    <div className={styles.container}>
      <Head>
        <title>HubSpot to Docusaurus</title>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          <a>HubSpot to Docusaurus</a>
        </h1>

        <p className={styles.description}></p>

        <div className={styles.grid}>
          <div className={styles.card}>
            {!loading && (
              <div>
                <h2>Select HubSpot Exported CSV &rarr;</h2>
                <input onChange={handleFileSelect} type="file" />
              </div>
            )}
            {loading && <h2>Wait, converting to Docusaurus...</h2>}
          </div>
        </div>
      </main>

      <footer className={styles.footer}></footer>
    </div>
  );
}

function processFile(file: File, setLoading) {
  Papa.parse(file, { complete: (result) => complete(result, setLoading) });
}
