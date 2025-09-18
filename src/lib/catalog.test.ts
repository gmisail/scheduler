import { describe, it, expect } from "vitest";
import {
  blocksOverlap,
  sectionsOverlap,
  type Block,
  type Section,
} from "./catalog";

describe("blocksOverlap", () => {
  describe("same day blocks", () => {
    it("should return true when blocks overlap completely", () => {
      const block1: Block = {
        crn: 12345,
        sec: "01",
        building: "SCI",
        room: "101",
        instructor: "Dr. Smith",
        start_time: 480, // 8:00 AM
        end_time: 540, // 9:00 AM
        day: "Monday",
      };

      const block2: Block = {
        crn: 67890,
        sec: "02",
        building: "SCI",
        room: "102",
        instructor: "Dr. Jones",
        start_time: 480, // 8:00 AM
        end_time: 540, // 9:00 AM
        day: "Monday",
      };

      expect(blocksOverlap(block1, block2)).toBe(true);
    });

    it("should return true when blocks overlap partially", () => {
      const block1: Block = {
        crn: 12345,
        sec: "01",
        building: "SCI",
        room: "101",
        instructor: "Dr. Smith",
        start_time: 480, // 8:00 AM
        end_time: 540, // 9:00 AM
        day: "Monday",
      };

      const block2: Block = {
        crn: 67890,
        sec: "02",
        building: "SCI",
        room: "102",
        instructor: "Dr. Jones",
        start_time: 520, // 8:40 AM
        end_time: 600, // 10:00 AM
        day: "Monday",
      };

      expect(blocksOverlap(block1, block2)).toBe(true);
    });

    it("should return true when block1 starts during block2", () => {
      const block1: Block = {
        crn: 12345,
        sec: "01",
        building: "SCI",
        room: "101",
        instructor: "Dr. Smith",
        start_time: 500, // 8:20 AM
        end_time: 580, // 9:40 AM
        day: "Monday",
      };

      const block2: Block = {
        crn: 67890,
        sec: "02",
        building: "SCI",
        room: "102",
        instructor: "Dr. Jones",
        start_time: 480, // 8:00 AM
        end_time: 520, // 8:40 AM
        day: "Monday",
      };

      expect(blocksOverlap(block1, block2)).toBe(true);
    });

    it("should return true when block2 starts during block1", () => {
      const block1: Block = {
        crn: 12345,
        sec: "01",
        building: "SCI",
        room: "101",
        instructor: "Dr. Smith",
        start_time: 480, // 8:00 AM
        end_time: 520, // 8:40 AM
        day: "Monday",
      };

      const block2: Block = {
        crn: 67890,
        sec: "02",
        building: "SCI",
        room: "102",
        instructor: "Dr. Jones",
        start_time: 500, // 8:20 AM
        end_time: 580, // 9:40 AM
        day: "Monday",
      };

      expect(blocksOverlap(block1, block2)).toBe(true);
    });

    it("should return true when block1 completely contains block2", () => {
      const block1: Block = {
        crn: 12345,
        sec: "01",
        building: "SCI",
        room: "101",
        instructor: "Dr. Smith",
        start_time: 480, // 8:00 AM
        end_time: 600, // 10:00 AM
        day: "Monday",
      };

      const block2: Block = {
        crn: 67890,
        sec: "02",
        building: "SCI",
        room: "102",
        instructor: "Dr. Jones",
        start_time: 500, // 8:20 AM
        end_time: 540, // 9:00 AM
        day: "Monday",
      };

      expect(blocksOverlap(block1, block2)).toBe(true);
    });

    it("should return true when block2 completely contains block1", () => {
      const block1: Block = {
        crn: 12345,
        sec: "01",
        building: "SCI",
        room: "101",
        instructor: "Dr. Smith",
        start_time: 500, // 8:20 AM
        end_time: 540, // 9:00 AM
        day: "Monday",
      };

      const block2: Block = {
        crn: 67890,
        sec: "02",
        building: "SCI",
        room: "102",
        instructor: "Dr. Jones",
        start_time: 480, // 8:00 AM
        end_time: 600, // 10:00 AM
        day: "Monday",
      };

      expect(blocksOverlap(block1, block2)).toBe(true);
    });

    it("should return false when blocks do not overlap", () => {
      const block1: Block = {
        crn: 12345,
        sec: "01",
        building: "SCI",
        room: "101",
        instructor: "Dr. Smith",
        start_time: 480, // 8:00 AM
        end_time: 540, // 9:00 AM
        day: "Monday",
      };

      const block2: Block = {
        crn: 67890,
        sec: "02",
        building: "SCI",
        room: "102",
        instructor: "Dr. Jones",
        start_time: 540, // 9:00 AM
        end_time: 600, // 10:00 AM
        day: "Monday",
      };

      expect(blocksOverlap(block1, block2)).toBe(false);
    });

    it("should return false when block1 ends exactly when block2 starts", () => {
      const block1: Block = {
        crn: 12345,
        sec: "01",
        building: "SCI",
        room: "101",
        instructor: "Dr. Smith",
        start_time: 480, // 8:00 AM
        end_time: 540, // 9:00 AM
        day: "Monday",
      };

      const block2: Block = {
        crn: 67890,
        sec: "02",
        building: "SCI",
        room: "102",
        instructor: "Dr. Jones",
        start_time: 540, // 9:00 AM
        end_time: 600, // 10:00 AM
        day: "Monday",
      };

      expect(blocksOverlap(block1, block2)).toBe(false);
    });

    it("should return false when block2 ends exactly when block1 starts", () => {
      const block1: Block = {
        crn: 12345,
        sec: "01",
        building: "SCI",
        room: "101",
        instructor: "Dr. Smith",
        start_time: 540, // 9:00 AM
        end_time: 600, // 10:00 AM
        day: "Monday",
      };

      const block2: Block = {
        crn: 67890,
        sec: "02",
        building: "SCI",
        room: "102",
        instructor: "Dr. Jones",
        start_time: 480, // 8:00 AM
        end_time: 540, // 9:00 AM
        day: "Monday",
      };

      expect(blocksOverlap(block1, block2)).toBe(false);
    });

    it("should overlap if start times are the same", () => {
      const sections = [
        {
          id: "9c88572b-4b30-4452-a51c-24caefcebc68",
          course_id: "aad6fd14-39d7-492e-9f43-0bbbb2cba390",
          crn: 92681,
          sec: "G",
          days: new Map([
            [
              "T",
              [
                {
                  crn: 92681,
                  sec: "G",
                  building: "LAFAYE",
                  room: "L403",
                  instructor: "Lavallee, Brian ",
                  start_time: 985,
                  end_time: 1060,
                },
              ],
            ],
            [
              "R",
              [
                {
                  crn: 92681,
                  sec: "G",
                  building: "LAFAYE",
                  room: "L403",
                  instructor: "Lavallee, Brian ",
                  start_time: 985,
                  end_time: 1060,
                },
              ],
            ],
          ]),
        } as Section,
        {
          id: "71399d09-5309-4670-8912-cafbd20a754d",
          course_id: "3fe707da-82a2-4355-bbaf-1fe489c60d33",
          crn: 95034,
          sec: "A06",
          days: new Map([
            [
              "T",
              [
                {
                  crn: 95034,
                  sec: "A06",
                  building: "TERRIL",
                  room: "222",
                  instructor: "Platzer, JoAnna M",
                  start_time: 510,
                  end_time: 690,
                } as Block,
              ],
            ],
          ]),
        } as Section,
      ];

      expect(sectionsOverlap(sections[0], sections[1])).toBe(false);
    });
  });

  describe("different day blocks", () => {
    it("should return false when blocks are on different days", () => {
      const block1: Block = {
        crn: 12345,
        sec: "01",
        building: "SCI",
        room: "101",
        instructor: "Dr. Smith",
        start_time: 480, // 8:00 AM
        end_time: 540, // 9:00 AM
        day: "Monday",
      };

      const block2: Block = {
        crn: 67890,
        sec: "02",
        building: "SCI",
        room: "102",
        instructor: "Dr. Jones",
        start_time: 480, // 8:00 AM
        end_time: 540, // 9:00 AM
        day: "Tuesday",
      };

      expect(blocksOverlap(block1, block2)).toBe(false);
    });

    it("should return false when blocks overlap in time but different days", () => {
      const block1: Block = {
        crn: 12345,
        sec: "01",
        building: "SCI",
        room: "101",
        instructor: "Dr. Smith",
        start_time: 480, // 8:00 AM
        end_time: 600, // 10:00 AM
        day: "Wednesday",
      };

      const block2: Block = {
        crn: 67890,
        sec: "02",
        building: "SCI",
        room: "102",
        instructor: "Dr. Jones",
        start_time: 500, // 8:20 AM
        end_time: 580, // 9:40 AM
        day: "Friday",
      };

      expect(blocksOverlap(block1, block2)).toBe(false);
    });
  });

  describe("edge cases", () => {
    it("should handle zero duration blocks", () => {
      const block1: Block = {
        crn: 12345,
        sec: "01",
        building: "SCI",
        room: "101",
        instructor: "Dr. Smith",
        start_time: 480, // 8:00 AM
        end_time: 480, // 8:00 AM
        day: "Monday",
      };

      const block2: Block = {
        crn: 67890,
        sec: "02",
        building: "SCI",
        room: "102",
        instructor: "Dr. Jones",
        start_time: 480, // 8:00 AM
        end_time: 540, // 9:00 AM
        day: "Monday",
      };

      expect(blocksOverlap(block1, block2)).toBe(false);
    });

    it("should handle late night blocks", () => {
      const block1: Block = {
        crn: 12345,
        sec: "01",
        building: "SCI",
        room: "101",
        instructor: "Dr. Smith",
        start_time: 1320, // 10:00 PM
        end_time: 1380, // 11:00 PM
        day: "Monday",
      };

      const block2: Block = {
        crn: 67890,
        sec: "02",
        building: "SCI",
        room: "102",
        instructor: "Dr. Jones",
        start_time: 1350, // 10:30 PM
        end_time: 1410, // 11:30 PM
        day: "Monday",
      };

      expect(blocksOverlap(block1, block2)).toBe(true);
    });
  });
});
