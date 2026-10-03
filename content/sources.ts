// Tài liệu tham khảo cho từng kỹ thuật. Mỗi liên kết đã được mở và đối chiếu nội dung (09/2026).

export interface Source {
  site: "HoDoKu" | "SudokuWiki";
  title: string;
  url: string;
}

const HODOKU = "https://hodoku.sourceforge.net/en/";
const WIKI = "https://www.sudokuwiki.org/";

const hodoku = (title: string, path: string): Source => ({ site: "HoDoKu", title, url: HODOKU + path });
const wiki = (title: string, path: string): Source => ({ site: "SudokuWiki", title, url: WIKI + path });

export const SOURCES: Record<string, Source[]> = {
  "full-house": [hodoku("Full House/Last Digit", "tech_singles.php#fh"), wiki("Getting Started", "Getting_Started")],
  "hidden-single-box": [hodoku("Hidden Single", "tech_singles.php#h1"), wiki("Getting Started", "Getting_Started")],
  "hidden-single-line": [hodoku("Hidden Single", "tech_singles.php#h1"), wiki("Getting Started", "Getting_Started")],
  "naked-single": [hodoku("Naked Single", "tech_singles.php#n1"), wiki("Getting Started", "Getting_Started")],
  pointing: [hodoku("Locked Candidates Type 1 (Pointing)", "tech_intersections.php#lc1"), wiki("Intersection Removal", "Intersection_Removal")],
  claiming: [hodoku("Locked Candidates Type 2 (Claiming)", "tech_intersections.php#lc2"), wiki("Intersection Removal", "Intersection_Removal")],
  "naked-pair": [hodoku("Naked Pair", "tech_naked.php#n2"), wiki("Naked Candidates", "Naked_Candidates")],
  "hidden-pair": [hodoku("Hidden Pair", "tech_hidden.php#h2"), wiki("Hidden Candidates", "Hidden_Candidates")],
  "naked-triple": [hodoku("Naked Triple", "tech_naked.php#n3"), wiki("Naked Candidates", "Naked_Candidates")],
  "hidden-triple": [hodoku("Hidden Triple", "tech_hidden.php#h3"), wiki("Hidden Candidates", "Hidden_Candidates")],
  "x-wing": [hodoku("X-Wing", "tech_fishb.php#bf2"), wiki("X-Wing Strategy", "X_Wing_Strategy")],
  skyscraper: [hodoku("Skyscraper", "tech_sdp.php#sk")],
  "two-string-kite": [hodoku("2-String Kite", "tech_sdp.php#t2sk")],
  "xy-wing": [hodoku("XY-Wing", "tech_wings.php#xy"), wiki("Y-Wing Strategy", "Y_Wing_Strategy")],
  "xyz-wing": [hodoku("XYZ-Wing", "tech_wings.php#xyz"), wiki("XYZ-Wing", "XYZ_Wing")],
  "w-wing": [hodoku("W-Wing", "tech_wings.php#w"), wiki("W-Wing Strategy", "W_Wing_Strategy")],
  swordfish: [
    hodoku("Swordfish", "tech_fishb.php#bf3"),
    hodoku("Jellyfish", "tech_fishb.php#bf4"),
    wiki("Swordfish Strategy", "Sword_Fish_Strategy"),
  ],
  "simple-coloring": [hodoku("Simple Colors (Color Trap, Color Wrap)", "tech_col.php#sc"), wiki("Simple Colouring (Rule 2, Rule 4)", "Simple_Colouring")],
  "unique-rectangle": [hodoku("Unique Rectangle Type 1", "tech_ur.php#u1"), wiki("Unique Rectangles", "Unique_Rectangles")],
  "bug-plus-one": [hodoku("BUG+1", "tech_ur.php#bug1"), wiki("BUG", "BUG")],
  "xy-chain": [hodoku("XY-Chain", "tech_chains.php#xyc"), wiki("XY-Chains", "XY_Chains")],
};
