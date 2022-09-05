import { useEffect, useState } from "react";
import throttle from "lodash/throttle";
import { NavItem } from "./tools";

import scroll from "react-scroll";
export default function (props: { items: NavItem[]; headingOffset: number }) {
  const { items } = props;
  const [currIndex, setCurrIndex] = useState(-1);
  const handleScroll = throttle((ev: Event) => {
    ev.stopPropagation();
    ev.preventDefault();

    let top: any = null;
    let topEl: any = null;
    let lastMin = 9999999999;
    for (const each of items) {
      const el: any = document.querySelector(`[data-id="${each.text}"]`);

      if (!topEl) {
        top = each;
        topEl = el;
      }
      if (el) {
        const scrollTop =
          window.pageYOffset ||
          document.documentElement.scrollTop ||
          document.body.scrollTop ||
          0;
        const v = Math.abs(scrollTop + props.headingOffset - el.offsetTop);
        if (v <= lastMin) {
          lastMin = v;
          top = each;
          topEl = el;
        }
      }
    }
    setCurrIndex(top.index);

    // updateHash(top.text);
  }, 100);
  useEffect(() => {
    const el = document.querySelector(".markdown-navigation div.active");
    if (el) {
      let to = (el as any)?.offsetTop;
      if (to <= props.headingOffset) {
        to = 0;
      }
      scroll.animateScroll.scrollTo(to, {
        containerId: "toc-container",
        smooth: true,
        delay: 0,
        spyThrottle: 0,
      });
    }
  }, [currIndex, props.headingOffset]);
  //TODO 逻辑完善的 hash 更新
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });
  const res = [];
  for (const each of items) {
    const cls = `title-anchor title-level${each.level} ${
      currIndex == each.index ? "active" : ""
    }`;
    res.push(
      <div
        key={each.index}
        className={cls}
        onClick={() => {
          const el: any = document.querySelector(`[data-id="${each.text}"]`);

          if (el) {
            let to = el.offsetTop - props.headingOffset;
            if (to <= 100) {
              to = 0;
            }
            scroll.animateScroll.scrollTo(to);
          }
        }}
      >
        {each.text}
      </div>
    );
  }
  return (
    <>
      <div
        className="text-center text-lg font-medium mt-4 text-gray-700 dark:text-dark cursor-pointer"
        onClick={() => {
          scroll.animateScroll.scrollToTop();
        }}
      >
        目录
      </div>
      <div className="markdown-navigation">{res}</div>
    </>
  );
}
