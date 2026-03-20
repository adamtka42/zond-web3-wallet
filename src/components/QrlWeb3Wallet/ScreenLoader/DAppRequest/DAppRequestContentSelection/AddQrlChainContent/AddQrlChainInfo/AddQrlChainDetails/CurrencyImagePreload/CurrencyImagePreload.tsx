import { cva } from "class-variance-authority";
import { useEffect, useState } from "react";

type CurrencyImagePreloadProps = {
  iconUrls: string[];
};

const currencyImageClasses = cva("mt-1 transition-all duration-1000", {
  variants: {
    hasValidUrl: {
      true: ["h-8 w-8 mr-4 opacity-100"],
      false: ["h-8 w-0 opacity-0"],
    },
  },
  defaultVariants: {
    hasValidUrl: false,
  },
});

const CurrencyImagePreload = ({ iconUrls }: CurrencyImagePreloadProps) => {
  const [validUrl, setValidUrl] = useState<string | undefined>();

  useEffect(() => {
    let hasUnmounted = false;

    (async () => {
      for (const url of iconUrls) {
        try {
          await new Promise<void>((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve();
            img.onerror = () => reject();
            img.src = url;
          });

          if (!hasUnmounted) {
            setValidUrl(url);
            break;
          }
        } catch {
          continue;
        }
      }
    })();

    return () => {
      hasUnmounted = true;
    };
  }, [iconUrls]);

  return (
    <img
      src={validUrl}
      alt="Currency icon"
      className={currencyImageClasses({ hasValidUrl: !!validUrl })}
    />
  );
};

export default CurrencyImagePreload;
