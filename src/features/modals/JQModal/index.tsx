import React from "react";
import type { ModalProps } from "@mantine/core";
import { Stack, Modal, Button, Text, Anchor, Group, TextInput } from "@mantine/core";
import { VscLinkExternal } from "react-icons/vsc";
import useJsonQuery from "../../../hooks/useJsonQuery";
import { useTranslation } from "../../../hooks/useTranslation";

export const JQModal = ({ opened, onClose }: ModalProps) => {
  const { updateJson } = useJsonQuery();
  const [query, setQuery] = React.useState("");
  const { t } = useTranslation();

  return (
    <Modal title={t("JSON Query (jq)")} size="lg" opened={opened} onClose={onClose} centered>
      <Stack>
        <Text fz="sm">
          {t("JQ Description")}
          <br />
          <Anchor
            fz="sm"
            target="_blank"
            href="https://jqlang.github.io/jq/manual/"
            rel="noopener noreferrer"
          >
            {t("Read documentation")} <VscLinkExternal />
          </Anchor>
        </Text>
        <TextInput
          leftSection="jq"
          placeholder={t("Enter jq query")}
          value={query}
          onChange={e => setQuery(e.currentTarget.value)}
        />
        <Group justify="right">
          <Button onClick={() => updateJson(query, onClose)}>{t("Display on Graph")}</Button>
        </Group>
      </Stack>
    </Modal>
  );
};
