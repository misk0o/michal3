import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import './AboutUs.css';

export const metadata = { title: "About Us | Zoskagram" };

export default function AboutUs() {
  return (
    <Container maxWidth="md" className="about-container">
      <Typography variant="h4" component="h1" className="title">
        O nás
      </Typography>
      <Typography variant="body1" paragraph className="intro-text">
        Vitajte na oficiálnej stránke Strednej priemyselnej školy elektrotechnickej Zochova! Naša škola je miestom, kde sa budúci odborníci na elektrotechniku, automatizáciu a informatiku stretávajú s kvalitným vzdelaním a moderným prístupom k výučbe. Sme hrdí na našu tradíciu, ktorá spája teoretické vedomosti s praktickými skúsenosťami, čím pripravujeme našich študentov na úspešnú kariéru v dynamickom svete technológií.
      </Typography>
      <Typography variant="body1" paragraph className="intro-text">
        Na Zochovej sa zameriavame na inovatívne vzdelávacie metódy, ktoré podporujú kreativitu a kritické myslenie. Naši žiaci získavajú nielen odborné zručnosti, ale aj schopnosť riešiť komplexné problémy a pracovať v tímoch. Okrem technických predmetov venujeme veľkú pozornosť aj rozvoju mäkkých zručností, ktoré sú nevyhnutné v dnešnom pracovnom prostredí.
      </Typography>
      <Typography variant="body1" className="link-text">
        Pre viac informácií o našich programoch, aktivitách a školských podujatiach nás sledujte na nasledujúcich platformách:
      </Typography>

      <Typography variant="body1" component="div" className="link-container">
        <Link href="https://zochova.sk/" target="_blank" rel="noopener" className="link">
          Official Website
        </Link>
      </Typography>
      <Typography variant="body1" component="div" className="link-container">
        <Link href="https://www.facebook.com/spsezochova/" target="_blank" rel="noopener" className="link">
          Facebook Page
        </Link>
      </Typography>
      <Typography variant="body1" component="div" className="link-container">
        <Link href="https://www.instagram.com/spsezochova/" target="_blank" rel="noopener" className="link">
          Instagram Profile
        </Link>
      </Typography>
    </Container>
  );
}
