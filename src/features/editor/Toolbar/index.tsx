import React, { useMemo } from "react";
import { Group, Select, Button } from "@mantine/core";
import styled from "styled-components";
import toast from "react-hot-toast";
import { AiOutlineFullscreen } from "react-icons/ai";
import { FaToolbox } from "react-icons/fa";
import { type FileFormat, formats } from "../../../enums/file.enum";
import { useTranslation } from "../../../hooks/useTranslation";
import useFile from "../../../store/useFile";
import { FileMenu } from "./FileMenu";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ToolsMenu } from "./ToolsMenu";
import { ViewMenu } from "./ViewMenu";
import { StyledToolElement } from "./styles";

const StyledTools = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  align-items: center;
  gap: 4px;
  justify-content: space-between;
  height: 40px;
  padding: 4px 8px;
  background: ${({ theme }) => theme.TOOLBAR_BG};
  color: ${({ theme }) => theme.SILVER};
  z-index: 36;
  border-bottom: 1px solid ${({ theme }) => theme.SILVER_DARK};

  @media only screen and (max-width: 320px) {
    display: none;
  }
`;

export const Toolbar = () => {
  const setFormat = useFile(state => state.setFormat);
  const format = useFile(state => state.format);
  const { t, currentLanguage } = useTranslation();

  const translationKey = useMemo(() => `translate-key-${currentLanguage}`, [currentLanguage]);

  const fullscreenBrowser = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {
        toast.error(t("Unable to enter fullscreen mode."));
      });
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  return (
    <StyledTools>
      <Group gap="xs" justify="left" w="100%" style={{ flexWrap: "nowrap" }}>
        <Select
          defaultValue="json"
          size="xs"
          value={format}
          onChange={e => setFormat(e as FileFormat)}
          miw={80}
          w={120}
          data={formats}
          allowDeselect={false}
        />

        <FileMenu key={`file-menu-${translationKey}`} />
        <ViewMenu key={`view-menu-${translationKey}`} />
        <ToolsMenu key={`tools-menu-${translationKey}`} />

        <Button
          component="a"
          href="https://tools.cmdragon.cn/"
          target="_blank"
          rel="noopener"
          color="blue"
          size="compact-sm"
          fz="12"
          fw="600"
          leftSection={<FaToolbox size={14} />}
          key={`more-tools-${translationKey}`}
        >
          {t("More Tools")}
        </Button>
      </Group>
      <Group gap="xs" justify="right" w="100%" style={{ flexWrap: "nowrap" }}>
        <LanguageSwitcher key={`lang-switcher-${translationKey}`} />
        <StyledToolElement
          title={t("Fullscreen")}
          onClick={fullscreenBrowser}
          key={`fullscreen-${translationKey}`}
        >
          <AiOutlineFullscreen size="18" />
        </StyledToolElement>
      </Group>
    </StyledTools>
  );
};
