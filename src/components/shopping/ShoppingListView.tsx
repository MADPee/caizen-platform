/**
 * CaiZen - ShoppingListView
 * Smart inköpslista med artikel-info, butikgruppering och status-hantering
 */

import React, { useState } from "react";
import {
  ShoppingCart,
  Check,
  Trash2,
  ExternalLink,
  Plus,
  Minus,
  Package,
  MapPin,
  Truck,
  Clipboard,
  Tag,
  ChevronDown,
  ChevronUp,
  CircleDollarSign,
  CheckCircle,
} from "lucide-react";
import type {
  ShoppingList,
  ShoppingListItem,
  ShoppingListItemStatus,
} from "../../types";

interface ShoppingListViewProps {
  list: ShoppingList | null;
  onUpdateStatus: (itemId: string, status: ShoppingListItemStatus) => void;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  isLoading: boolean;
  className?: string;
}

function formatSEK(amount: number): string {
  return new Intl.NumberFormat("sv-SE", {
    style: "currency",
    currency: "SEK",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function RetailerGroup({
  retailerName,
  items,
  onUpdateStatus,
  onUpdateQuantity,
  onRemoveItem,
}: {
  retailerName: string;
  items: ShoppingListItem[];
  onUpdateStatus: (itemId: string, status: ShoppingListItemStatus) => void;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const groupTotal = items.reduce((sum, i) => sum + i.totalPriceSEK, 0);
  const pendingCount = items.filter((i) => i.status === "pending").length;
  const purchasedCount = items.filter((i) => i.status === "purchased").length;
  const isOnline = items[0]?.url.includes("http");

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
      <div
        className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-750 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-gray-700 rounded flex items-center justify-center">
            {isOnline ? (
              <Truck size={14} className="text-blue-400" />
            ) : (
              <MapPin size={14} className="text-green-400" />
            )}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">{retailerName}</h4>
            <div className="flex items-center gap-2 text-[10px] text-gray-400">
              <span>{items.length} artiklar</span>
              {pendingCount > 0 && (
                <span className="text-blue-400">{pendingCount} att köpa</span>
              )}
              {purchasedCount > 0 && (
                <span className="text-green-400">{purchasedCount} köpta</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold">{formatSEK(groupTotal)}</span>
          {expanded ? (
            <ChevronUp size={16} className="text-gray-400" />
          ) : (
            <ChevronDown size={16} className="text-gray-400" />
          )}
        </div>
      </div>

      {expanded && (
        <div className="border-t border-gray-700">
          {items.map((item) => (
            <ShoppingItemRow
              key={item.id}
              item={item}
              onUpdateStatus={onUpdateStatus}
              onUpdateQuantity={onUpdateQuantity}
              onRemoveItem={onRemoveItem}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ShoppingItemRow({
  item,
  onUpdateStatus,
  onUpdateQuantity,
  onRemoveItem,
}: {
  item: ShoppingListItem;
  onUpdateStatus: (itemId: string, status: ShoppingListItemStatus) => void;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
}) {
  const isPurchased = item.status === "purchased";

  return (
    <div
      className={`flex items-center gap-3 p-3 border-b border-gray-700/50 last:border-b-0 transition-colors ${
        isPurchased ? "opacity-60 bg-green-900/10" : "hover:bg-gray-700/30"
      }`}
    >
      {/* Checkbox */}
      <button
        onClick={() =>
          onUpdateStatus(item.id, isPurchased ? "pending" : "purchased")
        }
        className={`h-5 w-5 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${
          isPurchased
            ? "bg-green-600 border-green-500"
            : "border-gray-500 hover:border-blue-400"
        }`}
      >
        {isPurchased && <Check size={12} />}
      </button>

      {/* Produktinfo */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={`text-sm font-medium ${isPurchased ? "line-through text-gray-500" : "text-white"}`}
          >
            {item.productName}
          </span>
          {item.specifications["High Mileage"] === "Ja" && (
            <span className="text-[9px] bg-purple-600/30 text-purple-400 px-1.5 py-0.5 rounded">
              HIGH MILEAGE
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-0.5">
          {item.articleNumber && (
            <span className="flex items-center gap-1 text-[10px] text-gray-400 bg-gray-700 px-1.5 py-0.5 rounded">
              <Tag size={9} />
              Art.nr: {item.articleNumber}
            </span>
          )}
          {Object.entries(item.specifications)
            .filter(
              ([key]) =>
                !["Artikelnummer", "Biltema Art.nr", "High Mileage"].includes(
                  key,
                ),
            )
            .slice(0, 3)
            .map(([key, val]) => (
              <span
                key={key}
                className="text-[10px] text-gray-500 bg-gray-700/50 px-1.5 py-0.5 rounded"
              >
                {key}: {val}
              </span>
            ))}
          <span className="text-[10px] text-gray-500">{item.unitSize}L</span>
        </div>
        {item.notes && (
          <p className="text-[10px] text-yellow-400/80 mt-1 italic">
            {item.notes}
          </p>
        )}
      </div>

      {/* Antal */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          onClick={() =>
            item.quantity > 1
              ? onUpdateQuantity(item.id, item.quantity - 1)
              : undefined
          }
          disabled={item.quantity <= 1}
          className="h-6 w-6 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-30 flex items-center justify-center transition-colors"
        >
          <Minus size={12} />
        </button>
        <span className="text-sm font-medium w-6 text-center">
          {item.quantity}
        </span>
        <button
          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
          className="h-6 w-6 rounded bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors"
        >
          <Plus size={12} />
        </button>
      </div>

      {/* Pris */}
      <div className="text-right flex-shrink-0 w-20">
        <div className="text-sm font-bold">{formatSEK(item.totalPriceSEK)}</div>
        {item.quantity > 1 && (
          <div className="text-[10px] text-gray-500">
            {formatSEK(item.selectedPriceSEK)} st
          </div>
        )}
      </div>

      {/* Åtgärder */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="h-7 w-7 rounded bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-blue-400 transition-colors"
          title="Öppna i butik"
        >
          <ExternalLink size={12} />
        </a>
        <button
          onClick={() => onRemoveItem(item.id)}
          className="h-7 w-7 rounded bg-gray-700 hover:bg-red-900 flex items-center justify-center text-gray-400 hover:text-red-400 transition-colors"
          title="Ta bort"
        >
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
}

const ShoppingListView: React.FC<ShoppingListViewProps> = ({
  list,
  onUpdateStatus,
  onUpdateQuantity,
  onRemoveItem,
  isLoading,
  className = "",
}) => {
  if (isLoading) {
    return (
      <div className={`text-center py-16 ${className}`}>
        <ShoppingCart
          size={32}
          className="mx-auto text-gray-600 animate-pulse mb-3"
        />
        <p className="text-sm text-gray-400">Laddar inköpslista...</p>
      </div>
    );
  }

  if (!list || list.items.length === 0) {
    return (
      <div className={`text-center py-16 ${className}`}>
        <ShoppingCart size={48} className="mx-auto text-gray-600 mb-4" />
        <h3 className="text-lg font-medium text-gray-400">
          Inköpslistan är tom
        </h3>
        <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
          Gå till Prisjämförelse, sök efter produkter och klicka "Lägg till i
          inköpslista" för att komma igång.
        </p>
      </div>
    );
  }

  const pendingItems = list.items.filter((i) => i.status === "pending");
  const purchasedItems = list.items.filter((i) => i.status === "purchased");

  const byRetailer = new Map<string, ShoppingListItem[]>();
  for (const item of pendingItems) {
    const key = item.selectedRetailerName;
    const existing = byRetailer.get(key) ?? [];
    byRetailer.set(key, [...existing, item]);
  }

  const retailerGroups = [...byRetailer.entries()].sort(
    (a, b) => b[1].length - a[1].length,
  );

  const progress =
    list.itemCount > 0
      ? Math.round((list.purchasedCount / list.itemCount) * 100)
      : 0;

  return (
    <div className={className}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <ShoppingCart className="text-orange-500" size={24} />
              {list.name}
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              {list.itemCount} artiklar · {list.purchasedCount} köpta
            </p>
          </div>
        </div>
      </div>

      {/* Statistik */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-3">
          <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
            <Clipboard size={14} />
            Att köpa
          </div>
          <div className="text-xl font-bold text-blue-400">
            {pendingItems.length}
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-3">
          <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
            <CheckCircle size={14} />
            Köpta
          </div>
          <div className="text-xl font-bold text-green-400">
            {purchasedItems.length}
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-3">
          <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
            <CircleDollarSign size={14} />
            Uppskattad kostnad
          </div>
          <div className="text-xl font-bold">
            {formatSEK(list.totalEstimatedCostSEK)}
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-3">
          <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
            <Package size={14} />
            Butiker
          </div>
          <div className="text-xl font-bold">{retailerGroups.length}</div>
        </div>
      </div>

      {/* Progress bar */}
      {list.itemCount > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>Framsteg</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-green-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Artiklar grupperade per butik */}
      {retailerGroups.length > 0 && (
        <div className="space-y-3 mb-6">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            Att köpa — grupperat per butik
          </h3>
          {retailerGroups.map(([retailerName, items]) => (
            <RetailerGroup
              key={retailerName}
              retailerName={retailerName}
              items={items}
              onUpdateStatus={onUpdateStatus}
              onUpdateQuantity={onUpdateQuantity}
              onRemoveItem={onRemoveItem}
            />
          ))}
        </div>
      )}

      {/* Köpta artiklar */}
      {purchasedItems.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-2">
            <CheckCircle size={12} className="text-green-500" />
            Köpta ({purchasedItems.length})
          </h3>
          <div className="bg-gray-800 rounded-lg border border-gray-700">
            {purchasedItems.map((item) => (
              <ShoppingItemRow
                key={item.id}
                item={item}
                onUpdateStatus={onUpdateStatus}
                onUpdateQuantity={onUpdateQuantity}
                onRemoveItem={onRemoveItem}
              />
            ))}
          </div>
          <div className="text-right text-xs text-gray-500">
            Köpt för totalt{" "}
            <span className="text-green-400 font-medium">
              {formatSEK(list.totalPurchasedCostSEK)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingListView;
