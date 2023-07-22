interface EditionI {
  id: string;
  name: string;
  description: string;
}

interface ScreenshotI {
  status: string;
  mode: string;
  timeOfCapture: string | null;
  filekeyRaw: string | null;
  filekeyStyled: string | null;
  filesize: number | null;
}

interface FeatureEditionI {
  edition: Omit<EditionI, "description">;
}

interface FeatureI {
  id: string;
  name: string;
  active: boolean;
  description: string;
  URL: string | null;
  selector: string | null;
  takeScreenshot: string | null;
  filename: string;
  screenshots: { items: ScreenshotI[] };
  FeatureEditions: { items: FeatureEditionI[] };
}

interface DataI {
  id: string;
  name: string;
  active: boolean;
  tagline: string;
  description: string;
  URL: string;
  modeDesktopLight: boolean;
  modeDesktopDark: boolean | null;
  modeLaptopLight: boolean | null;
  modeLaptopDark: boolean | null;
  modeMobileLight: boolean;
  modeMobileDark: boolean;
  editions: { items: EditionI[] };
  features: { items: FeatureI[] };
}


type ValidSortKey = keyof FeatureI | keyof EditionI | keyof ScreenshotI;

interface ColumnI {
  label: string;
  title: ValidSortKey;
  sort: boolean;
}
export type { DataI, EditionI, FeatureEditionI, FeatureI, ScreenshotI, ColumnI, ValidSortKey };
