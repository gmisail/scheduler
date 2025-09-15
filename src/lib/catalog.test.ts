import { describe, it, expect } from "vitest";
import { blocksOverlap, type Block } from "./catalog";

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
