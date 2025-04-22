import { useCallback, useEffect, useState } from "react";
import enTranslations from "../locales/en/common.json";
import zhTranslations from "../locales/zh/common.json";

// 翻译映射
const translations: Record<string, Record<string, string>> = {
  en: enTranslations,
  zh: zhTranslations,
};

// 获取默认语言，优先使用存储的语言，然后是浏览器语言
const getDefaultLanguage = (): string => {
  // 如果不在浏览器环境中，返回默认语言
  if (typeof window === "undefined") return "en";

  try {
    // 尝试从本地存储中获取已保存的语言设置
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "zh")) {
      return savedLanguage;
    }

    // 如果没有保存的语言，尝试从浏览器设置中检测
    const browserLanguage = navigator.language.toLowerCase();
    return browserLanguage.startsWith("zh") ? "zh" : "en";
  } catch (error) {
    // 如果出现任何错误（例如禁用了localStorage），则使用默认语言
    console.error("Error detecting language:", error);
    return "en";
  }
};

export const useTranslation = () => {
  // 服务器端渲染时使用默认语言，客户端使用实际语言
  const [language, setLanguage] = useState<string>("en");
  // 添加更新计数器，用于强制组件在语言变化时重新渲染
  const [, setUpdateCounter] = useState(0);

  // 在客户端初始化时获取默认语言
  useEffect(() => {
    const detectedLang = getDefaultLanguage();
    setLanguage(detectedLang);

    // 添加语言变化的事件监听器，确保多个组件的语言保持同步
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "language" && e.newValue) {
        if (e.newValue === "en" || e.newValue === "zh") {
          setLanguage(e.newValue);
          setUpdateCounter(prev => prev + 1);
        }
      }
    };

    // 监听我们自定义的语言变化事件
    const handleLanguageChangeEvent = (e: CustomEvent) => {
      const { language: newLang } = e.detail;
      if (newLang && (newLang === "en" || newLang === "zh")) {
        setLanguage(newLang);
        setUpdateCounter(prev => prev + 1);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("languageChange", handleLanguageChangeEvent as EventListener);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("languageChange", handleLanguageChangeEvent as EventListener);
    };
  }, [setUpdateCounter]);

  // 翻译函数 - 始终返回有效字符串
  const t = useCallback(
    (key: string): string => {
      // 首先尝试当前语言的翻译
      if (translations[language]?.[key]) {
        return translations[language][key];
      }

      // 如果没有找到，尝试英文翻译
      if (translations.en?.[key]) {
        return translations.en[key];
      }

      // 如果都没有找到，返回键名作为后备
      return key;
    },
    [language]
  ); // 移除updateCounter作为依赖项

  // 切换语言
  const changeLanguage = useCallback(
    (lang: string) => {
      if (lang === "en" || lang === "zh") {
        try {
          // 保存到本地存储
          localStorage.setItem("language", lang);
          // 更新状态
          setLanguage(lang);
          // 增加更新计数器，强制刷新
          setUpdateCounter(prev => prev + 1);

          // 触发一个自定义事件，确保其他使用useTranslation的组件也能知晓语言变化
          const event = new CustomEvent("languageChange", { detail: { language: lang } });
          window.dispatchEvent(event);
        } catch (error) {
          console.error("Error saving language setting:", error);
        }
      }
    },
    [setUpdateCounter]
  );

  return {
    t,
    changeLanguage,
    currentLanguage: language,
  };
};
