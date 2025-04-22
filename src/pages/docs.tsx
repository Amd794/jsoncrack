import React from "react";
import dynamic from "next/dynamic";
import { Group, Paper, Stack, Text, Title } from "@mantine/core";
import { CodeHighlight } from "@mantine/code-highlight";
import styled from "styled-components";
import { NextSeo } from "next-seo";
import { SEO } from "../constants/seo";
import { useTranslation } from "../hooks/useTranslation";
import Layout from "../layout/PageLayout";

const StyledContentBody = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 15px;
  line-height: 1.8;
  overflow-x: auto;
`;

const StyledHighlight = styled.span<{ $link?: boolean; $alert?: boolean }>`
  display: inline-block;
  text-align: left;
  color: ${({ theme, $link, $alert }) =>
    $alert ? theme.DANGER : $link ? theme.BLURPLE : theme.TEXT_POSITIVE};
  background: ${({ theme }) => theme.BACKGROUND_TERTIARY};
  border-radius: 4px;
  font-weight: 500;
  padding: 2px 4px;
  font-size: 14px;
  margin: ${({ $alert }) => ($alert ? "8px 0" : "1px")};
`;

// 动态导入 CodepenEmbed 组件，禁用服务器端渲染
const CodepenEmbed = dynamic(() => import("../components/CodepenEmbed"), {
  ssr: false,
});

const Docs = () => {
  const { t } = useTranslation();

  return (
    <Layout>
      <NextSeo
        {...SEO}
        title={t("Documentation - JSON Crack")}
        description={t("Integrate JSON Crack widgets into your website.")}
        canonical="https://jsoncrack.cmdragon.cn/docs"
      />
      <Stack mx="auto" maw="90%">
        <Group mb="lg" mt={40}>
          <Title order={1} c="dark">
            {t("Embed")}
          </Title>
        </Group>
        <Paper bg="white" c="black" p="md" radius="md" withBorder>
          <Title mb="sm" order={3} c="dark">
            # {t("Fetching from URL")}
          </Title>
          <StyledContentBody>
            <Text>
              {t("By adding")} <StyledHighlight>?json=https://catfact.ninja/fact</StyledHighlight>{" "}
              {t(
                "query at the end of iframe src you will be able to fetch from URL at widgets without additional scripts. This applies to editor page as well, the following link will fetch the url at the editor:"
              )}{" "}
              <StyledHighlight
                as="a"
                href="https://jsoncrack.cmdragon.cn/editor?json=https://catfact.ninja/fact"
                $link
              >
                https://jsoncrack.cmdragon.cn/editor?json=https://catfact.ninja/fact
              </StyledHighlight>
            </Text>

            <CodepenEmbed id="KKBpWVR" title="Fetching from URL Example" defaultTab="html,result" />
          </StyledContentBody>
        </Paper>
        <Paper bg="white" c="black" p="md" radius="md" withBorder>
          <Title mb="sm" order={3} c="dark">
            # {t("Communicating with API")}
          </Title>
          <Title order={4}>◼︎ {t("Post Message to Embed")}</Title>
          <StyledContentBody>
            <Text>
              {t("Communicating with the embed is possible with")}{" "}
              <StyledHighlight
                as="a"
                href="https://developer.mozilla.org/en-US/docs/Web/API/MessagePort/postMessage"
                $link
              >
                {t("MessagePort")}
              </StyledHighlight>
              {t(
                ', you should pass an object consist of "json" and "options" key where json is a string and options is an object that may contain the following:'
              )}
              <CodeHighlight
                w={500}
                language="json"
                code={
                  '{\n  theme: "light" | "dark",\n  direction: "TOP" | "RIGHT" | "DOWN" | "LEFT"\n}'
                }
                withCopyButton={false}
              />
            </Text>

            <CodepenEmbed
              id="rNrVyWP"
              title="Post Message Example"
              defaultTab="html,result"
              scrolling="no"
            />
          </StyledContentBody>
        </Paper>
        <Paper bg="white" c="black" p="md" radius="md" withBorder>
          <Title order={4}>◼︎ {t("On Page Load")}</Title>
          <StyledContentBody>
            <Text>
              <Text>
                ⚠️ <b>{t("Important!")}</b> - {t("iframe should be defined before the script tag")}
              </Text>
              <Text>
                ⚠️ <b>{t("Note")}</b> -{" "}
                {t("Widget is not loaded immediately with the parent page. The widget sends its")}{" "}
                <b>{t("id")}</b>{" "}
                {t(
                  "attribute so you can listen for it as in the example below to ensure its loaded and ready to listen for messages."
                )}
              </Text>
            </Text>
            <CodepenEmbed id="QWBbpqx" title="On Page Load Example" defaultTab="html,result" />
          </StyledContentBody>
        </Paper>
      </Stack>
    </Layout>
  );
};

export default Docs;
