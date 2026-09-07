const LOGO_URL =
  "https://res.cloudinary.com/dydg39ukk/image/upload/v1788805959/twentyfourseven-white_qatrph.png";

export default function LandingFooter() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#070707] py-12">
      <div className="box-container">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <img
              src={LOGO_URL}
              alt="24/7Box"
              className="h-10 w-auto"
            />

            <p className="mt-4 max-w-sm text-sm leading-6 text-[#747474]">
              Movies, series and
              personalized entertainment
              available around the clock.
            </p>
          </div>

          <FooterGroup
            title="Discover"
            links={[
              "Movies",
              "Series",
              "Trending",
              "New releases",
            ]}
          />

          <FooterGroup
            title="Account"
            links={[
              "Profiles",
              "My List",
              "Settings",
              "Help",
            ]}
          />

          <FooterGroup
            title="Legal"
            links={[
              "Privacy",
              "Terms",
              "Cookies",
              "Contact",
            ]}
          />
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/[0.06] pt-7 text-xs text-[#575757] sm:flex-row sm:items-center sm:justify-between">
          <span>
            © 2026 24/7Box.
            All rights reserved.
          </span>

          <span>
            Entertainment,
            whenever you're ready.
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterGroup({
  title,
  links,
}) {
  return (
    <div>
      <p className="text-sm font-bold text-white">
        {title}
      </p>

      <div className="mt-4 grid gap-3">
        {links.map(
          (link) => (
            <a
              key={link}
              href="#"
              className="text-sm text-[#747474] transition hover:text-[#FFD900]"
            >
              {link}
            </a>
          )
        )}
      </div>
    </div>
  );
}