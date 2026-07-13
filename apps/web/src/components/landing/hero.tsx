import Link from "next/link";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-end overflow-hidden bg-ink pt-24">
      {/* Background image with gradient overlay */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center scale-105"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(14,12,10,.35) 0%, rgba(14,12,10,.5) 45%, rgba(14,12,10,.92) 100%), url('https://placehold.co/1920x1080/14110F/B4893F?text=Anh+Du+An')",
        }}
      />

      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-10 pb-24 text-white">
        <div className="flex items-center gap-3.5 mb-5 font-mono text-xs tracking-[0.24em] uppercase text-gold-light">
          <span className="w-11 h-px bg-gold-light" />
          [Tên Công Ty] — [Vị Trí Dự Án]
        </div>

        <h1 className="font-display font-medium text-white leading-[0.98] tracking-tight mb-6 text-5xl sm:text-6xl lg:text-8xl max-w-4xl">
          Không Gian Sống
          <br />
          <span className="italic text-gold">Đẳng Cấp Mới</span>
        </h1>

        <p className="text-lg leading-relaxed text-white/75 max-w-lg mb-11 font-light">
          [Tên Dự Án] — nơi kiến tạo chuẩn mực sống mới, kết hợp hài hòa giữa
          không gian riêng tư và tiện ích đẳng cấp giữa lòng thành phố.
        </p>

        <div className="flex gap-4 flex-wrap mb-16">
          <Link
            href="#lien-he"
            className="inline-flex items-center gap-2.5 px-8 py-4 font-mono text-xs font-semibold tracking-wider uppercase bg-gold text-ink transition-all hover:bg-gold-light hover:-translate-y-1"
          >
            Nhận Bảng Giá
          </Link>
          <Link
            href="#tong-quan"
            className="inline-flex items-center gap-2.5 px-8 py-4 font-mono text-xs font-semibold tracking-wider uppercase border border-white/40 text-white transition-all hover:border-white hover:-translate-y-1 hover:bg-white/5"
          >
            Khám Phá Dự Án
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-6 border-t border-white/15 pt-8 max-w-3xl">
          <Stat number="—" label="Căn hộ" />
          <Stat number="—" label="Tòa tháp" />
          <Stat number="—" label="Diện tích" />
          <Stat number="—" label="Tiện ích" />
        </div>
      </div>
    </section>
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div className="pr-11 sm:border-r border-white/10 last:border-r-0">
      <div className="font-display font-medium text-3xl text-gold-light leading-none">
        {number}
      </div>
      <div className="font-mono text-[11px] tracking-wide text-white/55 mt-2 uppercase">
        {label}
      </div>
    </div>
  );
}
