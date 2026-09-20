import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";

const images = [
  {
    "url": "https://images.unsplash.com/photo-1549692520-acc6669e2f0c?auto=format&fit=crop&w=1200&q=82",
    "id": "1519817650390-64a93db511aa",
    "file": "01-1519817650390-64a93db511aa.jpg"
  },
  {
    "url": "https://images.unsplash.com/photo-1747515203898-2df8f083f417?auto=format&fit=crop&w=1200&q=82",
    "id": "1594736797933-d0501ba2fe65",
    "file": "02-1594736797933-d0501ba2fe65.jpg"
  },
  {
    "url": "https://images.unsplash.com/photo-1574144659703-1659dda2e0b1?auto=format&fit=crop&w=1200&q=82",
    "id": "1500534623283-312aade485b7",
    "file": "03-1500534623283-312aade485b7.jpg"
  },
  {
    "url": "https://images.unsplash.com/photo-1665674613803-be933fd4cd1a?auto=format&fit=crop&w=1200&q=82",
    "id": "1521587760476-6c12a4b040da",
    "file": "04-1521587760476-6c12a4b040da.jpg"
  },
  {
    "url": "https://images.unsplash.com/photo-1763568258320-c954a19683e3?auto=format&fit=crop&w=1200&q=82",
    "id": "1564399579883-451a5d44ec08",
    "file": "05-1564399579883-451a5d44ec08.jpg"
  },
  {
    "url": "https://images.unsplash.com/photo-1662667465161-d853dfa901ea?auto=format&fit=crop&w=1200&q=82",
    "id": "1519681393784-d120267933ba",
    "file": "06-1519681393784-d120267933ba.jpg"
  },
  {
    "url": "https://images.unsplash.com/photo-1747515203898-2df8f083f417?auto=format&fit=crop&w=1200&q=82",
    "id": "1518005020951-eccb494ad742",
    "file": "07-1518005020951-eccb494ad742.jpg"
  },
  {
    "url": "https://images.unsplash.com/photo-1574144659703-1659dda2e0b1?auto=format&fit=crop&w=1200&q=82",
    "id": "1532012197267-da84d127e765",
    "file": "08-1532012197267-da84d127e765.jpg"
  },
  {
    "url": "https://images.unsplash.com/photo-1665674613803-be933fd4cd1a?auto=format&fit=crop&w=1200&q=82",
    "id": "1519682337058-a94d519337bc",
    "file": "09-1519682337058-a94d519337bc.jpg"
  },
  {
    "url": "https://images.unsplash.com/photo-1763568258320-c954a19683e3?auto=format&fit=crop&w=1200&q=82",
    "id": "1524231757912-21f4fe3a7200",
    "file": "10-1524231757912-21f4fe3a7200.jpg"
  },
  {
    "url": "https://images.unsplash.com/photo-1662667465161-d853dfa901ea?auto=format&fit=crop&w=1200&q=82",
    "id": "1455390582262-044cdead277a",
    "file": "11-1455390582262-044cdead277a.jpg"
  },
  {
    "url": "https://images.unsplash.com/photo-1747515203898-2df8f083f417?auto=format&fit=crop&w=1200&q=82",
    "id": "1589254065878-42c9da997008",
    "file": "12-1589254065878-42c9da997008.jpg"
  },
  {
    "url": "https://images.unsplash.com/photo-1574144659703-1659dda2e0b1?auto=format&fit=crop&w=1200&q=82",
    "id": "1499750310107-5fef28a66643",
    "file": "13-1499750310107-5fef28a66643.jpg"
  },
  {
    "url": "https://images.unsplash.com/photo-1665674613803-be933fd4cd1a?auto=format&fit=crop&w=1200&q=82",
    "id": "1542751371-adc38448a05e",
    "file": "14-1542751371-adc38448a05e.jpg"
  },
  {
    "url": "https://images.unsplash.com/photo-1763568258320-c954a19683e3?auto=format&fit=crop&w=1200&q=82",
    "id": "1553484771-047a44eee27b",
    "file": "15-1553484771-047a44eee27b.jpg"
  },
  {
    "url": "https://images.unsplash.com/photo-1662667465161-d853dfa901ea?auto=format&fit=crop&w=1200&q=82",
    "id": "1551288049-bebda4e38f71",
    "file": "16-1551288049-bebda4e38f71.jpg"
  },
  {
    "url": "https://images.unsplash.com/photo-1747515203898-2df8f083f417?auto=format&fit=crop&w=1200&q=82",
    "id": "1485846234645-a62644f84728",
    "file": "17-1485846234645-a62644f84728.jpg"
  },
  {
    "url": "https://images.unsplash.com/photo-1574144659703-1659dda2e0b1?auto=format&fit=crop&w=1200&q=82",
    "id": "1457369804613-52c61a468e7d",
    "file": "18-1457369804613-52c61a468e7d.jpg"
  },
  {
    "url": "https://images.unsplash.com/photo-1665674613803-be933fd4cd1a?auto=format&fit=crop&w=1200&q=82",
    "id": "1524995997946-a1c2e315a42f",
    "file": "19-1524995997946-a1c2e315a42f.jpg"
  },
  {
    "url": "https://images.unsplash.com/photo-1763568258320-c954a19683e3?auto=format&fit=crop&w=1200&q=82",
    "id": "1516321318423-f06f85e504b3",
    "file": "20-1516321318423-f06f85e504b3.jpg"
  },
  {
    "url": "https://images.unsplash.com/photo-1662667465161-d853dfa901ea?auto=format&fit=crop&w=1200&q=82",
    "id": "1677442136019-21780ecad995",
    "file": "21-1677442136019-21780ecad995.jpg"
  },
  {
    "url": "https://images.unsplash.com/photo-1747515203898-2df8f083f417?auto=format&fit=crop&w=1200&q=82",
    "id": "1551650975-87deedd944c3",
    "file": "22-1551650975-87deedd944c3.jpg"
  },
  {
    "url": "https://images.unsplash.com/photo-1574144659703-1659dda2e0b1?auto=format&fit=crop&w=1200&q=82",
    "id": "1559028012-481c04fa702d",
    "file": "23-1559028012-481c04fa702d.jpg"
  },
  {
    "url": "https://images.unsplash.com/photo-1665674613803-be933fd4cd1a?auto=format&fit=crop&w=1200&q=82",
    "id": "1461749280684-dccba630e2f6",
    "file": "24-1461749280684-dccba630e2f6.jpg"
  },
  {
    "url": "https://images.unsplash.com/photo-1763568258320-c954a19683e3?auto=format&fit=crop&w=1200&q=82",
    "id": "1455390582262-044cdead277a",
    "file": "25-1455390582262-044cdead277a.jpg"
  },
  {
    "url": "https://images.unsplash.com/photo-1662667465161-d853dfa901ea?auto=format&fit=crop&w=1200&q=82",
    "id": "1499750310107-5fef28a66643",
    "file": "26-1499750310107-5fef28a66643.jpg"
  },
  {
    "url": "https://images.unsplash.com/photo-1747515203898-2df8f083f417?auto=format&fit=crop&w=1200&q=82",
    "id": "1542751371-adc38448a05e",
    "file": "27-1542751371-adc38448a05e.jpg"
  },
  {
    "url": "https://images.unsplash.com/photo-1574144659703-1659dda2e0b1?auto=format&fit=crop&w=1200&q=82",
    "id": "1516321318423-f06f85e504b3",
    "file": "28-1516321318423-f06f85e504b3.jpg"
  }
];

const outDir = join(process.cwd(), "public", "images");
await mkdir(outDir, { recursive: true });

for (const image of images) {
  const target = join(outDir, image.file);
  if (existsSync(target)) {
    console.log(`Exists: ${image.file}`);
    continue;
  }
  console.log(`Downloading: ${image.url}`);
  const response = await fetch(image.url);
  if (!response.ok) throw new Error(`Failed ${response.status}: ${image.url}`);
  const buffer = Buffer.from(await response.arrayBuffer());
  await writeFile(target, buffer);
}
console.log(`Prepared ${images.length} local image assets.`);
