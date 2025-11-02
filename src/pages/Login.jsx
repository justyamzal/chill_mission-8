import { Link } from "react-router-dom";
import PasswordInput from "../components/PasswordInput";

export default function Login() {
  return (
    <main
      className="min-h-screen w-full bg-cover bg-center text-white"
      style={{ backgroundImage: "url('/bg-img/bg-login.png')" }}
    >
      <div className="mx-auto flex min-h-screen max-w-[529px] items-center justify-center px-4">
        <section className="w-full rounded-2xl bg-[rgba(24,26,28,0.84)] p-10 shadow-lg">
          {/* Header */}
          <header className="mb-9 flex flex-col items-center gap-9 text-center">
            <img src="/icon/Logo.png" alt="logo" className="w-40 md:w-48" />
            <div className="flex flex-col gap-2">
              <h3 className="text-2xl font-bold md:text-3xl">Masuk</h3>
              <p className="text-base leading-relaxed text-zinc-200">
                Selamat datang kembali
              </p>
            </div>
          </header>

          {/* Form */}
          <form className="flex flex-col gap-9">
            <div className="flex flex-col gap-2">
              <label htmlFor="username" className="text-sm md:text-base font-medium">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                placeholder="Masukkan username"
                required
                className="w-full rounded-full border border-white/20 bg-transparent px-5 py-3 text-base text-zinc-300 outline-none placeholder:text-zinc-400 focus:ring-2 focus:ring-white/20"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm md:text-base font-medium">
                Kata Sandi
              </label>
              <PasswordInput id="password" name="password" required />
            </div>

            <div className="flex items-center justify-between text-sm text-zinc-400 md:text-base">
              <span>
                Belum punya akun?{" "}
                <Link to="/register" className="text-white hover:underline">
                  Daftar
                </Link>
              </span>
              <a href="#" className="text-white hover:underline">
                Lupa kata sandi?
              </a>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-2">
              <button
                type="submit"
                className="rounded-full border border-white/20 bg-zinc-700 px-5 py-3 text-base font-semibold hover:bg-zinc-600"
              >
                Masuk
              </button>
              <div className="flex items-center justify-center text-sm text-zinc-400">
                Atau
              </div>
              <button
                type="button"
                className="flex items-center justify-center gap-5 rounded-full border border-white/20 bg-transparent px-5 py-3 text-base font-semibold hover:bg-white/5"
              >
                <img src="/icon/google-icon.svg" alt="" className="h-5 w-5" />
                Masuk dengan Google
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
