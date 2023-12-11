import Slot, { ISolt, IItem } from "@/components/Slot";
import { useEffect, useState } from "react";

function generateGameSlots(): Map<number, ISolt> {
  let currentId: number = 0;
  const maxSlots: number = 10;
  const maxCoinsPerSlot: number = 5;
  const coinTypes: number = 5;

  const slotsMap = new Map<
    number,
    { id: number; items: { id: number; value: number }[] }
  >();
  const coinCount: number[] = Array(coinTypes).fill(0);

  const guaranteedCoin: number = Math.floor(Math.random() * coinTypes) + 1;
  coinCount[guaranteedCoin - 1] = 5;

  for (let i = 0; i < maxSlots; i++) {
    const slotId = currentId++;
    const items = [];

    const neededCoins = i < maxSlots - 1 ? maxCoinsPerSlot : 0;
    for (let j = 0; j < neededCoins; j++) {
      let coinValue: number;
      do {
        coinValue = Math.floor(Math.random() * coinTypes) + 1;
      } while (coinValue === guaranteedCoin && coinCount[coinValue - 1] >= 5);

      items.push({ id: currentId++, value: coinValue });
      coinCount[coinValue - 1]++;
    }

    slotsMap.set(slotId, { id: slotId, items: items });
  }

  return slotsMap;
}

function areAllValuesSame(arr: IItem[]): boolean {
  if (arr.length === 0) {
    return true; // 空数组可以认为是所有值都相同
  }

  const firstValue = arr[0].value;
  for (const item of arr) {
    if (item.value !== firstValue) {
      return false; // 发现一个不同的value，立即返回false
    }
  }

  return true; // 所有元素的value都相同
}

function splitArray(arr: IItem[]) {
  if (arr.length === 0) {
    return { sameValueItems: [], remainingItems: [] };
  }

  const lastValue = arr[arr.length - 1].value;
  let i = arr.length - 1;

  while (i >= 0 && arr[i].value === lastValue) {
    i--;
  }

  const sameValueItems = arr.slice(i + 1);
  const remainingItems = arr.slice(0, i + 1);

  // 返回相同的数据和剩余的数据
  return { sameValueItems, remainingItems };
}

function App() {
  const [slots, setSlots] = useState<Map<number, ISolt>>();
  const [selectedSlot, setSelectedSlot] = useState<ISolt>();

  useEffect(() => {
    setSlots(generateGameSlots());
  }, []);

  const select = (solt: ISolt) => {
    if (selectedSlot) {
      let selectedSlotId = selectedSlot.id;
      let { sameValueItems, remainingItems } = splitArray(selectedSlot.items);
      let newSlots = new Map(slots);

      newSlots?.set(solt.id, {
        id: solt.id,
        items: [...solt.items, ...sameValueItems],
      });
      newSlots?.set(selectedSlotId, {
        id: selectedSlotId,
        items: remainingItems,
      });

      // 清空上次选中的数据
      setSelectedSlot(undefined);
      const currentSoltItemsLen = newSlots.get(solt.id)?.items.length!;
      const lastSoltItem = slots?.get(solt.id)?.items.at(-1);
      if (lastSoltItem && lastSoltItem?.value !== sameValueItems[0].value) {
        // 放置的数据必须与被放置的数据最后一个值相等
        console.log("0.必须与被放置的最后一个值相等");
        setSelectedSlot(undefined);
        return;
      }

      if (solt.id === selectedSlotId) {
        // 不能放上一个选中的位置
        console.log("1.不能放上一个选中的位置");
        setSelectedSlot(undefined);
        return;
      }

      if (currentSoltItemsLen > 5) {
        // 硬币超过最大限制的数量
        console.log("2.超出最大凹槽容量限制");
        setSelectedSlot(undefined);
        return;
      }

      if (
        currentSoltItemsLen === 5 &&
        areAllValuesSame(newSlots.get(solt.id)?.items!)
      ) {
        console.log("🎉成功清空一组!");
        // 判断value是否全部相等(是的话就清空当前选中的数据)
        newSlots?.set(solt.id, {
          id: solt.id,
          items: [],
        });
      }
      setSlots(newSlots);
    } else {
      setSelectedSlot(solt);
    }
  };

  return (
    <>
      {JSON.stringify(selectedSlot?.items)}
      <div className="flex gap-5">
        {Array.from(slots?.entries() || []).map(([key, solt]) => (
          <div onClick={() => select(solt)} key={key}>
            <Slot id={solt.id} items={solt.items}></Slot>
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
