export const ssoText = {
  pagetitle: " Workspace login",
  workspaceLoginPage: {
    enableSignupLabel: "Enable Signup",
    helperText: "New account will be created for user's first time SSO sign in",
    allowDefaultSSOLabel: "Allow default SSO",
    allowDefaultSSOHelperText:
      "Allow users to authenticate via default SSO. Default SSO configurations can be overridden by \n workspace level SSO.",
    allowedDomainLabel: "Allowed domains",
    allowedDomainHelperText:
      "Support multiple domains. Enter domain names separated by comma. example: tooljet.com,tooljet.io,yourorganization.com",
    workspaceLoginUrl: "Login URL",
    workspaceLoginHelpText: "Use this URL to login directly to this workspace",
    ssoHeader: "SSO",
    instanceSSOHelperText: "Display default SSO for workspace URL login",
    googleLabel: "Google",
    githubLabel: "GitHub",
    defaultSSO: "Default SSO",
  },
  cancelButton: "Cancel",
  saveButton: "Save changes",
  allowedDomain: "tooljet.io,gmail.com",
  ssoToast: "Organization settings have been updated",
  ssoToast2: "updated SSO configurations",
  googleTitle: "Google",
  enabledLabel: "Enabled",
  googleSSOToast: "Saved Google SSO configurations",
  disabledLabel: "Disabled",

  googleSSOText: "Sign in with Google",
  clientIdLabel: "Client ID",
  redirectUrlLabel: "Redirect URL",
  clientId: "24567098-mklj8t20za1smb2if.apps.googleusercontent.com",
  testClientId: "12345-client-id-.apps.googleusercontent.com",
  gitTitle: "GitHub",
  clientSecretLabel: "Client secret",
  encriptedLabel: "Encrypted",
  gitEnabledToast: "Enabled GitHub SSO",
  gitSSOToast: "Saved Git SSO configurations",
  gitSignInText: "Sign in with GitHub",
  passwordTitle: "Password Login",
  passwordEnabledToast: "Enabled Password login",
  passwordDisabledToast: "Password login disabled successfully!",
  passwordDisableWarning:
    "Disable password login only if you have configured SSO or else you will get locked out.",
  hostNameLabel: "Host name",
  hostNameHelpText: "Required if GitHub is self hosted",
  hostName: "Tooljet",
  signInHeader: "Sign in",
  workspaceSubHeader: (workspaceName) => {
    return `Sign in to your workspace - ${workspaceName}`;
  },
  noLoginMethodWarning: "No login methods enabled for this workspace",
  googleSignUpText: "Sign up with Google",
  gitSignUpText: "Sign up with GitHub",
  gitUserStatusToast:
    "GitHub login failed - User does not exist in the workspace",
  passwordLoginToggleLbale: "Password login",
  alertText: "Danger zone",
  disablePasswordHelperText:
    "Disable password login only if your SSO is configured otherwise you will get locked out",
  toggleUpdateToast: (toggle) => {
    return `${toggle} configuration updated \n successfully`
  }
};
