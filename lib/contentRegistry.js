// every chapter's written content (concept, checkpoint, challenge, etc),
// keyed by chapter id. playgrounds live separately in ChapterShell since
// those are UI components, not content — this map is what anything
// outside the chapter page itself (pip, spaced recall) needs to reach in.

import { CH0_CONTENT } from "./content/ch0";
import { CH1_CONTENT } from "./content/ch1";
import { CH2_CONTENT } from "./content/ch2";
import { CH3_CONTENT } from "./content/ch3";
import { CH4_CONTENT } from "./content/ch4";
import { CH5_CONTENT } from "./content/ch5";
import { CH6_CONTENT } from "./content/ch6";
import { CH7_CONTENT } from "./content/ch7";
import { CH8_CONTENT } from "./content/ch8";
import { CH9_CONTENT } from "./content/ch9";
import { CH10_CONTENT } from "./content/ch10";
import { CH11_CONTENT } from "./content/ch11";
import { BOSS1_CONTENT } from "./content/boss1";
import { CH12_CONTENT } from "./content/ch12";
import { CH13_CONTENT } from "./content/ch13";
import { CH14_CONTENT } from "./content/ch14";
import { CH15_CONTENT } from "./content/ch15";
import { CH16_CONTENT } from "./content/ch16";
import { CH17_CONTENT } from "./content/ch17";
import { CH18_CONTENT } from "./content/ch18";
import { CH19_CONTENT } from "./content/ch19";
import { CH20_CONTENT } from "./content/ch20";
import { CH21_CONTENT } from "./content/ch21";
import { CH22_CONTENT } from "./content/ch22";
import { CH23_CONTENT } from "./content/ch23";
import { BOSS2_CONTENT } from "./content/boss2";
import { BOSS3_CONTENT } from "./content/boss3";
import { BOSS4_CONTENT } from "./content/boss4";

export const CONTENT = {
  ch0: CH0_CONTENT,
  ch1: CH1_CONTENT,
  ch2: CH2_CONTENT,
  ch3: CH3_CONTENT,
  ch4: CH4_CONTENT,
  ch5: CH5_CONTENT,
  ch6: CH6_CONTENT,
  ch7: CH7_CONTENT,
  ch8: CH8_CONTENT,
  ch9: CH9_CONTENT,
  ch10: CH10_CONTENT,
  ch11: CH11_CONTENT,
  boss1: BOSS1_CONTENT,
  ch12: CH12_CONTENT,
  ch13: CH13_CONTENT,
  ch14: CH14_CONTENT,
  ch15: CH15_CONTENT,
  ch16: CH16_CONTENT,
  ch17: CH17_CONTENT,
  ch18: CH18_CONTENT,
  ch19: CH19_CONTENT,
  ch20: CH20_CONTENT,
  ch21: CH21_CONTENT,
  ch22: CH22_CONTENT,
  ch23: CH23_CONTENT,
  boss2: BOSS2_CONTENT,
  boss3: BOSS3_CONTENT,
  boss4: BOSS4_CONTENT
};
