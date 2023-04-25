import { useState, useRef, useEffect } from "react";

const LazyImage = ({ src, alt, threshold = "200px" }) => {
  const [imgSrc, setImgSrc] = useState("");
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setImgSrc(src);
          imgRef.current && observer.unobserve(imgRef.current);
        }
      },
      {
        rootMargin: `${threshold} 0px`,
      }
    );

    imgRef.current && observer.observe(imgRef.current);

    return () => {
      if (imgRef.current) observer.unobserve(imgRef.current);
    };
  }, [src, threshold]);

  return <img ref={imgRef} src={imgSrc} alt={alt} />;
};

export default LazyImage;
