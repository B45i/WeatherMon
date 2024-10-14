import { ConfigProvider } from "antd";

export const ThemeProvider = ({ children }: { children: JSX.Element }) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#c8fd42",
        },
        components: {
          Button: {
            solidTextColor: "rgb(0,0,0)",
            primaryColor: "rgb(0,0,0)",
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};
