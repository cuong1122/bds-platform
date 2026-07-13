"use client";

import { useBuildings } from "@/features/listing/hooks";

export function BuildingsSection() {
  const { data: buildings, isLoading, isError } = useBuildings();

  return (
    <section className="bg-ink text-white/80 py-24" id="toa-thap">
      <div className="max-w-[1280px] mx-auto px-10">
        <div className="max-w-xl mx-auto text-center mb-14">
          <div className="flex items-center justify-center gap-3 font-mono text-xs tracking-[0.18em] uppercase text-gold-light font-semibold mb-4">
            <span className="w-8 h-px bg-gold-light" />
            Kiến Trúc
          </div>
          <h2 className="font-display font-medium text-white text-3xl sm:text-4xl lg:text-5xl leading-tight mb-4">
            Các Tòa Tháp Của Dự Án
          </h2>
          <p className="text-white/55 leading-relaxed">
            Mỗi tòa tháp mang một dấu ấn riêng, được thiết kế để tối ưu ánh
            sáng, tầm nhìn và sự riêng tư cho cư dân.
          </p>
        </div>
      </div>

      {isLoading && (
        <p className="text-center text-white/50 py-10">Đang tải dữ liệu...</p>
      )}

      {isError && (
        <p className="text-center text-red-400 py-10">
          Không thể tải danh sách tòa. Vui lòng thử lại sau.
        </p>
      )}

      {buildings && buildings.length === 0 && (
        <p className="text-center text-white/50 py-10">
          Chưa có tòa nào được thêm.
        </p>
      )}

      {buildings && buildings.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10">
          {buildings.map((building, idx) => (
            <div
              key={building.id}
              className="relative h-[420px] overflow-hidden bg-ink flex items-end group"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{
                  backgroundImage: `url('${
                    building.cover_image ||
                    "https://placehold.co/600x800/14110F/A8823D?text=" +
                      encodeURIComponent(building.name)
                  }')`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
              <div className="relative z-10 p-8 w-full">
                <div className="font-mono text-[11px] tracking-wider text-gold-light uppercase mb-2">
                  Tòa {String(idx + 1).padStart(2, "0")}
                </div>
                <div className="font-display italic font-medium text-2xl text-white mb-2">
                  {building.name}
                </div>
                <p className="text-sm text-white/60 leading-relaxed max-w-[280px]">
                  {building.address}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
