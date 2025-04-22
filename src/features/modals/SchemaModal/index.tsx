import React from "react";
import type { ModalProps } from "@mantine/core";
import { Stack, Modal, Button, Text, Anchor, Menu, Group, Paper } from "@mantine/core";
import Editor from "@monaco-editor/react";
import { event as gaEvent } from "nextjs-google-analytics";
import { toast } from "react-hot-toast";
import { FaChevronDown } from "react-icons/fa";
import { VscLinkExternal } from "react-icons/vsc";
import { FileFormat } from "../../../enums/file.enum";
import { useTranslation } from "../../../hooks/useTranslation";
import useConfig from "../../../store/useConfig";
import useFile from "../../../store/useFile";

export const SchemaModal = ({ opened, onClose }: ModalProps) => {
  const setContents = useFile(state => state.setContents);
  const setJsonSchema = useFile(state => state.setJsonSchema);
  const darkmodeEnabled = useConfig(state => (state.darkmodeEnabled ? "vs-dark" : "light"));
  const { t } = useTranslation();
  const [schema, setSchema] = React.useState(
    JSON.stringify(
      {
        $schema: "http://json-schema.org/draft-04/schema#",
        title: "Product",
        description: "A product from catalog",
        type: "object",
        properties: {
          id: {
            description: "The unique identifier for a product",
            type: "integer",
          },
        },
        required: ["id"],
      },
      null,
      2
    )
  );

  const onApply = () => {
    try {
      if (!schema || typeof schema !== "string" || schema.trim() === "") {
        toast.error(t("Invalid Schema"));
        return;
      }

      const parsedSchema = JSON.parse(schema);
      setJsonSchema(parsedSchema);

      gaEvent("apply_json_schema");
      toast.success(t("Applied schema!"));
      onClose();
    } catch (error) {
      toast.error(t("Invalid Schema"));
    }
  };

  const onClear = () => {
    setJsonSchema(null);
    setSchema("");
    toast(t("Disabled JSON Schema"));
    onClose();
  };

  const generateMockData = async () => {
    try {
      if (!schema || typeof schema !== "string" || schema.trim() === "") {
        toast.error(t("Invalid Schema"));
        return;
      }

      let parsedSchema;
      try {
        parsedSchema = JSON.parse(schema);
      } catch (parseError) {
        toast.error(t("Invalid Schema"));
        return;
      }

      const { JSONSchemaFaker } = await import("json-schema-faker");
      const data = JSONSchemaFaker.generate(parsedSchema);
      setContents({ contents: JSON.stringify(data, null, 2), format: FileFormat.JSON });

      gaEvent("generate_schema_mock_data");
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(t("Invalid Schema"));
    }
  };

  return (
    <Modal title={t("JSON Schema")} size="lg" opened={opened} onClose={onClose} centered>
      <Stack>
        <Text fz="sm">{t("Any validation failures are shown at the bottom toolbar of pane.")}</Text>
        <Anchor
          fz="sm"
          target="_blank"
          href="https://niem.github.io/json/sample-schema/"
          rel="noopener noreferrer"
        >
          {t("View Examples")} <VscLinkExternal />
        </Anchor>
        <Paper withBorder radius="sm" style={{ overflow: "hidden" }}>
          <Editor
            value={schema ?? ""}
            theme={darkmodeEnabled}
            onChange={e => setSchema(e!)}
            height={300}
            language="json"
            options={{
              formatOnPaste: true,
              tabSize: 2,
              formatOnType: true,
              scrollBeyondLastLine: false,
              stickyScroll: { enabled: false },
              minimap: { enabled: false },
            }}
          />
        </Paper>
        <Group p="0" justify="right">
          <Button variant="subtle" color="gray" onClick={onClear} disabled={!schema}>
            {t("Clear")}
          </Button>
          <Button.Group>
            <Button variant="default" onClick={onApply} disabled={!schema}>
              {t("Apply")}
            </Button>
            <Menu>
              <Menu.Target>
                <Button variant="default" color="blue" px="xs" disabled={!schema}>
                  <FaChevronDown />
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item onClick={generateMockData}>{t("Generate Mock Data")}</Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Button.Group>
        </Group>
      </Stack>
    </Modal>
  );
};
