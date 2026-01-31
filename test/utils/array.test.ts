import { add, addUnique, alreadyExists, getIndexByValue, getOtherIndexEqual} from "../../src/utils/array";

describe("array utils", () => {


  describe("alreadyExists", () => {
    it("should return true if the text already exists in the array", () => {
      const array = [
        { id: "1", value: "Hello World", type: "text", path: "", fixed: false },
        { id: "2", value: "Another Item", type: "text", path: "", fixed: false }
      ];
      expect(alreadyExists(array, "Hello World")).toBe(true);
    });

    it("should return false if the text does not exist in the array", () => {
      const array = [
        { id: "1", value: "Hello World", type: "text", path: "", fixed: false },
        { id: "2", value: "Another Item", type: "text", path: "", fixed: false }
      ];
      expect(alreadyExists(array, "Nonexistent Item")).toBe(false);
    });
  });


  describe("getIndexByValue", () => {
    it("should return the correct index of the item with the given text", () => {
      const array = [
        { id: "1", value: "Hello World", type: "text", path: "", fixed: false },
        { id: "2", value: "Another Item", type: "text", path: "", fixed: false }
      ];
      expect(getIndexByValue(array, "Another Item")).toBe(1);
    });

    it("should return -1 if the text does not exist in the array", () => {
      const array = [
        { id: "1", value: "Hello World", type: "text", path: "", fixed: false },
        { id: "2", value: "Another Item", type: "text", path: "", fixed: false }
      ];
      expect(getIndexByValue(array, "Nonexistent Item")).toBe(-1);
    });
  });


  describe("getOtherIndexEqual",()=>{


    it("should return the index of another item with the same text excluding the given index",()=>{

      const array=[
        { id: "1", value: "Hello World", type: "text", path: "", fixed: false },
        { id: "2", value: "Another Item", type: "text", path: "", fixed: false },
        { id: "3", value: "Hello World", type: "text", path: "", fixed: false }
      ]

      expect(getOtherIndexEqual(array,"Hello World",0)).toBe(2);
    })

    it("should return -1 if no other item with the same text exists excluding the given index",()=>{

      const array=[
        { id: "1", value: "Hello World", type: "text", path: "", fixed: false },
        { id: "2", value: "Another Item", type: "text", path: "", fixed: false },
        { id: "3", value: "Hello World", type: "text", path: "", fixed: false }
      ]

      expect(getOtherIndexEqual(array,"Another Item",1)).toBe(-1);
    })  
  });


  describe("addUnique", () => {


    it ("should add a new unique item to the array", () => {


      const array=[ { id: "1", value: "Hello World"}];


      expect(addUnique(array,"Hi There").length).toBe(2);
    });

    it("should not add a duplicate item to the array", () => {

      const array = [ { id: "1", value: "Hello World", type: "text", path: "", fixed: false }];
      
      expect(addUnique(array,"Hello World").length).toBe(1);
    });
  
  });

  



  describe("add", () => {
    it("should add a new item to the array", () => {
      const array = [
        { id: "1", value: "Hello World", type: "text", path: "", fixed: false }
      ];

      const newItem = {
        id: "2",
        value: "New Item",
        type: "text",
        path: ""
      }; 

      expect(add(array,newItem).length).toBe(2);

    });
  });

});