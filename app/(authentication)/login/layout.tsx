type AuthLayoutProps = {
  children: React.ReactNode;
};
const AuthLayout = ({ children }: AuthLayoutProps) => {
  return <div className="min-h-screen">{children}</div>;
};

export default AuthLayout;
