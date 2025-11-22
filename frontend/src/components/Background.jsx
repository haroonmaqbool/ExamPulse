import { useTheme } from './ThemeContext'

function Background() {
  const { theme } = useTheme()
  const isDarkMode = theme === 'dark'

  return (
    <>
      {isDarkMode ? (
        <>
          {/* Animated gradient background */}
          <div className="fixed inset-0 transition-colors duration-500 bg-gradient-to-br from-purple-900/20 via-black to-pink-900/20" />
          <div className="fixed inset-0">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/30 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-600/30 rounded-full blur-[120px] animate-pulse delay-700" />
            <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] animate-pulse delay-1000" />
          </div>
          {/* Grid pattern overlay */}
          <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
        </>
      ) : (
        <>
          {/* Animated gradient background */}
          <div className="fixed inset-0 transition-colors duration-500 bg-gradient-to-br from-blue-200/20 via-white to-green-200/20" />
          <div className="fixed inset-0">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-300/30 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-300/30 rounded-full blur-[120px] animate-pulse delay-700" />
            <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-300/20 rounded-full blur-[120px] animate-pulse delay-1000" />
          </div>
          {/* Grid pattern overlay */}
          <div className="fixed inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,white,transparent)]" />
        </>
      )}
    </>
  )
}

export default Background

