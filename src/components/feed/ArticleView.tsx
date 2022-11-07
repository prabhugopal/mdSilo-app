import React, { useEffect, useRef, useState } from "react";
import { IconLink, IconStar } from "@tabler/icons";
import { getFavicon, getReadableDatetime } from "utils/helper";
import { ArticleType } from "./data/dataType";

type ViewProps = {
  article: ArticleType | null;
  starArticle: (url: string, status: number) => Promise<void>;
};

export function ArticleView(props: ViewProps) {
  const { article, starArticle } = props;
  const [isStar, setIsStar] = useState(article?.star_status === 1);
  const [pageContent, setPageContent] = useState("");
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (article) {
      const content = (article.content || article.description || "").replace(
        /<a[^>]+>/gi,
        (a: string) => {
          if (!/\starget\s*=/gi.test(a)) {
            return a.replace(/^<a\s/, '<a target="_blank"');
          }

          return a;
        }
      );

      if (article.image && content.includes(article.image.split('/').slice(-1)[0])){
        setShowBanner(false)
      } else {
        setShowBanner(true)
      }

      setPageContent(content);

      setIsStar(article.star_status === 1);
    }
  }, [article]);

  if (!article) {
    return (
      <div className=""></div>
    );
  }

  const { title, url, author, published, image } = article;
  const ico = getFavicon(url);

  return (
    <div className="border-l-2 border-gray-500 ">
      <div className="sticky top-0 px-2 mb-2 bg-gray-200">
        <div className="text-3xl font-bold">{title}</div>
        <div className="flex items-center justify-start">
          <span className="h-4 w-4 m-1"><img src={ico} alt="#"/></span>
          <span className="m-1">
            {getReadableDatetime(published || '')}
          </span>
          <span className="m-1">{author}</span>
          <a
            className="m-1"
            target="_blank"
            rel="noreferrer"
            href={url}
          >
            <IconLink size={18} />
          </a>
          <span 
            className="m-1 cursor-pointer" 
            onClick={async () => {
              await starArticle(article.url, Math.abs(article.star_status - 1));
              setIsStar(!isStar);
            }}
          >
            <IconStar size={18} className={`text-red-500 ${isStar ? 'fill-red-500' : ''}`} />
          </span>
        </div>
      </div>
      <div className="p-2">
        {showBanner && image &&  <div className=""><img src={image} alt=""/></div>}
        <div
          className="text-lg px-2 content"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{__html: pageContent}}
        />
      </div>
    </div>
  );
}
