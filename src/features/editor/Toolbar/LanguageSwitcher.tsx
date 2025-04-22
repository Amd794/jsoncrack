import React from "react";
import { Flex, Menu } from "@mantine/core";
import { CgChevronDown } from "react-icons/cg";
import { FaLanguage } from "react-icons/fa";
import { useTranslation } from "../../../hooks/useTranslation";
import { StyledToolElement } from "./styles";

export const LanguageSwitcher = () => {
  const { t, changeLanguage, currentLanguage } = useTranslation();

  return (
    <Menu shadow="md" width={120} withArrow>
      <Menu.Target>
        <StyledToolElement title={t("Language")}>
          <Flex align="center" gap={3}>
            <FaLanguage size={18} />
            {currentLanguage === "zh" ? "中" : "EN"}
            <CgChevronDown />
          </Flex>
        </StyledToolElement>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>{t("Select Language")}</Menu.Label>
        <Menu.Item
          onClick={() => changeLanguage("en")}
          className={currentLanguage === "en" ? "active" : ""}
        >
          English
        </Menu.Item>
        <Menu.Item
          onClick={() => changeLanguage("zh")}
          className={currentLanguage === "zh" ? "active" : ""}
        >
          中文
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};
