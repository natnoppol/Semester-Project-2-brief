export default async function router(pathname = window.location.pathname) {
    switch (pathname) {
      case "/":
        await import("./views/home.js");
        break;
      case "/auth/":
        await import("./views/auth/auth.js");
        break;
      case "/auth/login/":
        await import("./views/auth/login.js");
        break;
      case "/auth/register/":
        await import("./views/auth/register.js");
        break;
      case "/profile/":
        await import("./views/profile/index.js");
        break;
      case "/profile/edit/":
        await import("./views/profile/update.js");
        break;
    //   case "/post/":
    //     await import("./views/post.js");
    //     break;
    //   case "/post/edit/":
    //     await import("./views/postEdit.js");
    //     break;
    //   case "/post/create/":
    //     await import("./views/postCreate.js");
    //     break;
      default:
        await import("./views/notFound.js");
    }
  }
