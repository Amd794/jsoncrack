import React from "react";
import type { ModalProps } from "@mantine/core";
import { Stack, Modal, Button, Text, Anchor, Group, TextInput } from "@mantine/core";
import { JSONPath } from "jsonpath-plus";
import { event as gaEvent } from "nextjs-google-analytics";
import toast from "react-hot-toast";
import { VscLinkExternal } from "react-icons/vsc";
import { useTranslation } from "../../../hooks/useTranslation";
import useFile from "../../../store/useFile";
import useJson from "../../../store/useJson";

export const JPathModal = ({ opened, onClose }: ModalProps) => {
  const getJson = useJson(state => state.getJson);
  const setContents = useFile(state => state.setContents);
  const [query, setQuery] = React.useState("");
  const { t } = useTranslation();

  const evaluteJsonPath = () => {
    try {
      const json = getJson();

      // 验证JSON字符串是否有效
      if (!json || typeof json !== "string" || json.trim() === "") {
        toast.error(t("Invalid JSON!"));
        return;
      }

      let parsedJson;
      try {
        parsedJson = JSON.parse(json);
      } catch (parseError) {
        toast.error(t("Invalid JSON!"));
        return;
      }

      const result = JSONPath({ path: query, json: parsedJson });

      setContents({ contents: JSON.stringify(result, null, 2) });
      gaEvent("run_json_path");
      onClose();
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
    }
  };

  return (
    <Modal title={t("JSON Path")} size="lg" opened={opened} onClose={onClose} centered>
      <Stack>
        <Text fz="sm">
          {t("JSON Path Description")}
          <br />
          <Anchor
            fz="sm"
            target="_blank"
            href="https://docs.oracle.com/cd/E60058_01/PDF/8.0.8.x/8.0.8.0.0/PMF_HTML/JsonPath_Expressions.htm"
            rel="noopener noreferrer"
          >
            {t("Read documentation")} <VscLinkExternal />
          </Anchor>
        </Text>
        <TextInput
          value={query}
          onChange={e => setQuery(e.currentTarget.value)}
          placeholder={t("Enter JSON Path...")}
          data-autofocus
        />
        <Group justify="right">
          <Button onClick={evaluteJsonPath} disabled={!query.length}>
            {t("Run")}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};
