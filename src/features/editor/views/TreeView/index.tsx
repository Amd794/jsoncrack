import React from "react";
import { useTheme } from "styled-components";
import { JSONTree } from "react-json-tree";
import useJson from "../../../../store/useJson";
import { Label } from "./Label";
import { Value } from "./Value";

export const TreeView = () => {
  const theme = useTheme();
  const json = useJson(state => state.json);

  // 安全地解析JSON
  const safeParseJson = () => {
    try {
      // 确保json是有效的字符串
      if (!json || typeof json !== "string" || json.trim() === "") {
        return {};
      }
      return JSON.parse(json);
    } catch (error) {
      console.error("JSON解析错误:", error);
      return {}; // 解析失败时返回空对象
    }
  };

  return (
    <JSONTree
      hideRoot
      data={safeParseJson()}
      valueRenderer={(valueAsString, value) => <Value {...{ valueAsString, value }} />}
      labelRenderer={(keyPath, nodeType) => <Label {...{ keyPath, nodeType }} />}
      theme={{
        extend: {
          overflow: "scroll",
          height: "100%",
          scheme: "monokai",
          author: "wimer hazenberg (http://www.monokai.nl)",
          base00: theme.GRID_BG_COLOR,
        },
      }}
    />
  );
};
