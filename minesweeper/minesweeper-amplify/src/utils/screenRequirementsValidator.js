const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(window.navigator.userAgent);
}

const validateMinScreenSizeAndDesktop = () => {
  const MIN_WIDTH_PX = 1200;
  const MIN_HEIGHT_PX = 600;
  return !isMobileDevice() && window.innerWidth >= MIN_WIDTH_PX && window.innerHeight >= MIN_HEIGHT_PX;
}

export default validateMinScreenSizeAndDesktop;