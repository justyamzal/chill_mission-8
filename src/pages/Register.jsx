import { Link } from "react-router-dom";
import PasswordInput from "../components/PasswordInput";

export default function Register() {
  return (
    <main
      className="min-h-screen w-full bg-cover bg-center text-white"
      style={{ backgroundImage: "url('/bg-img/bg-registration.png')" }}
    >
      <div className="mx-auto flex min-h-screen max-w-[529px] items-center justify-center px-4">
        <section className="w-full rounded-2xl bg-[rgba(24,26,28,0.84)] p-10 shadow-lg">
          {/* Header */}
          <header className="mb-9 flex flex-col items-center gap-9 text-center">
            <img src="/icon/Logo.png" alt="logo" className="w-40 md:w-48" />
            <div className="flex flex-col gap-2">
              <h3 className="text-2xl font-bold md:text-3xl">Daftar</h3>
              <p className="text-base leading-relaxed text-zinc-200">
                Selamat datang!
              </p>
            </div>
          </header>

          {/* Form */}
          <form className="flex flex-col gap-9">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="reg-username" className="text-sm md:text-base font-medium">
                Username
              </label>
              <input
                id="reg-username"
                name="username"
                type="text"
                placeholder="Masukkan username"
                className="w-full rounded-full border border-white/20 bg-transparent px-5 py-3 text-base text-zinc-300 outline-none placeholder:text-zinc-400 focus:ring-2 focus:ring-white/20"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="reg-password" className="text-sm md:text-base font-medium">
                Kata Sandi
              </label>
              <PasswordInput id="reg-password" name="password" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="reg-confirm" className="text-sm md:text-base font-medium">
                Konfirmasi Kata Sandi
              </label>
              <PasswordInput
                id="reg-confirm"
                name="confirm-password"
                placeholder="Masukkan kata sandi"
              />

              <div className="mt-2 flex items-center justify-between text-sm text-zinc-400 md:text-base">
                <span>
                  Sudah punya akun?{" "}
                  <Link to="/login" className="text-white hover:underline">
                    Masuk
                  </Link>
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-2">
              <button
                type="submit"
                className="rounded-full border border-white/20 bg-zinc-700 px-5 py-3 text-base font-semibold hover:bg-zinc-600"
              >
                Daftar
              </button>
              <div className="flex items-center justify-center text-sm text-zinc-400">
                Atau
              </div>
              <button
                type="button"
                className="flex items-center justify-center gap-5 rounded-full border border-white/20 bg-transparent px-5 py-3 text-base font-semibold hover:bg-white/5"
              >
                <img src="../public/icon/google-icon.svg" alt="" className="h-5 w-5" />
                Daftar dengan Google
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
