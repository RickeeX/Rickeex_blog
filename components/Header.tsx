import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Logo from '@/data/logo.svg'
import Link from './Link'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import SearchButton from './SearchButton'

const Header = () => {
  let headerClass = 'flex items-center w-full bg-white dark:bg-gray-950 justify-between py-10'
  if (siteMetadata.stickyNav) {
    headerClass += ' sticky top-0 z-50'
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white py-4 dark:border-gray-800 dark:bg-gray-950">
      {/* 修改点说明：
         1. 宽度控制：将 max-w-3xl 改为 w-full max-w-screen-2xl。
            这允许它在 iPad Pro 上尽可能展宽，直到极大的屏幕才限制宽度。
         2. 边距控制：px-4 sm:px-6 lg:px-12。
            lg:px-12 专门为 iPad Pro 和小笔记本设计，留出适度的"呼吸感"边距，但不会像原来那么巨大。
      */}
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-12 xl:px-12">
        <div>
          <Link href="/" aria-label={siteMetadata.headerTitle}>
            <div className="flex items-center justify-between">
              <div className="mr-3">
                <Logo className="fill-dark dark:fill-light" />
              </div>
              {typeof siteMetadata.headerTitle === 'string' ? (
                /* 修改重点：
                   1. 移除了 'hidden'，确保在所有屏幕上都显示。
                   2. 使用 'text-xl' (手机) 和 'sm:text-2xl' (电脑) 进行响应式字号调整。
                      这样手机上文字不会太大抢占空间，电脑上则保持大气。
                   3. 加上 'font-bold'，让小字号在手机上更有分量感。
                */
                <div className="text-xl font-bold sm:text-2xl sm:font-semibold">
                  {siteMetadata.headerTitle}
                </div>
              ) : (
                siteMetadata.headerTitle
              )}
            </div>
          </Link>
        </div>
        <div className="flex items-center space-x-4 leading-5 sm:space-x-6">
          {headerNavLinks
            .filter((link) => link.href !== '/')
            .map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="hidden font-medium text-gray-900 dark:text-gray-100 sm:block"
              >
                {link.title}
              </Link>
            ))}
          <SearchButton />
          <ThemeSwitch />
          <MobileNav />
        </div>
      </div>
    </header>
  )
}

export default Header
