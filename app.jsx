import { Fragment, jsxDEV } from "react/jsx-dev-runtime";
import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { WebsimSocket, useQuery } from "@websim/use-query";
const room = new WebsimSocket();
function RamenCard({ ramen, spoonsCount, onSpoon, onEdit, onDelete, isOwner }) {
  const isFeatured = ramen.featured;
  const featuredByTip = ramen.featured_reason === "tip";
  return /* @__PURE__ */ jsxDEV("div", { className: `relative bg-gray-800 rounded-lg p-4 transform transition-all duration-300 hover:scale-105 ${isFeatured ? "featured-glow" : ""}`, children: [
    isFeatured && /* @__PURE__ */ jsxDEV("div", { className: "absolute -top-2 -right-2 bg-yellow-500 text-gray-900 px-2 py-1 rounded-full text-xs font-bold", children: featuredByTip ? "\u{1F4B0} Featured" : "\u{1F525} Popular" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 14,
      columnNumber: 17
    }, this),
    /* @__PURE__ */ jsxDEV(
      "img",
      {
        src: ramen.image_url,
        alt: ramen.name,
        className: "w-full h-48 object-cover rounded-md mb-3"
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 19,
        columnNumber: 13
      },
      this
    ),
    /* @__PURE__ */ jsxDEV("h3", { className: "text-xl font-bold text-orange-400 mb-2", children: ramen.name }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 25,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("p", { className: "text-gray-300 text-sm mb-3", children: ramen.description }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 26,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "mb-3", children: [
      /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-gray-400", children: "Ingredients:" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 29,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-gray-300", children: ramen.ingredients?.join(", ") || "Not specified" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 30,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 28,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "flex items-center space-x-2", children: /* @__PURE__ */ jsxDEV("span", { className: "text-pink-400", children: [
        "\u{1F944} ",
        spoonsCount
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 35,
        columnNumber: 21
      }, this) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 34,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "flex space-x-2", children: [
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: () => onSpoon(ramen.id),
            className: "bg-pink-500 hover:bg-pink-600 px-3 py-1 rounded-full text-sm transition-colors",
            children: "Add Spoon"
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 39,
            columnNumber: 21
          },
          this
        ),
        isOwner && /* @__PURE__ */ jsxDEV(Fragment, { children: [
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: () => onEdit(ramen),
              className: "bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded-full text-sm transition-colors",
              children: "Edit"
            },
            void 0,
            false,
            {
              fileName: "<stdin>",
              lineNumber: 48,
              columnNumber: 29
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: () => onDelete(ramen.id),
              className: "bg-red-500 hover:bg-red-600 px-3 py-1 rounded-full text-sm transition-colors",
              children: "Delete"
            },
            void 0,
            false,
            {
              fileName: "<stdin>",
              lineNumber: 54,
              columnNumber: 29
            },
            this
          )
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 47,
          columnNumber: 25
        }, this)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 38,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 33,
      columnNumber: 13
    }, this)
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 12,
    columnNumber: 9
  }, this);
}
function Leaderboard() {
  const { data: ramenList, loading } = useQuery(room.collection("ramen"));
  const { data: spoons } = useQuery(room.collection("spoons"));
  const [currentUser, setCurrentUser] = useState(null);
  const [editingRamen, setEditingRamen] = useState(null);
  useEffect(() => {
    window.websim.getCurrentUser().then(setCurrentUser);
  }, []);
  const getSpoonCount = (ramenId) => {
    return spoons?.filter((s) => s.ramen_id === ramenId).length || 0;
  };
  const sortedRamen = ramenList?.sort((a, b) => {
    const aSpoons = getSpoonCount(a.id);
    const bSpoons = getSpoonCount(b.id);
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return bSpoons - aSpoons;
  });
  async function handleSpoon(ramenId) {
    if (!currentUser) return;
    const spoonId = `${currentUser.id}-${ramenId}`;
    await room.collection("spoons").upsert({
      id: spoonId,
      ramen_id: ramenId
    });
    const spoonsCount = getSpoonCount(ramenId) + 1;
    if (spoonsCount >= 10) {
      await room.collection("ramen").upsert({
        id: ramenId,
        featured: true,
        featured_reason: "spoons"
      });
    }
  }
  async function handleDelete(ramenId) {
    if (!confirm("Are you sure you want to delete this ramen creation?")) return;
    await room.collection("ramen").delete(ramenId);
    const ramenSpoons = spoons?.filter((s) => s.ramen_id === ramenId) || [];
    await Promise.all(
      ramenSpoons.map((spoon) => room.collection("spoons").delete(spoon.id))
    );
  }
  async function handleEdit(ramen) {
    setEditingRamen(ramen);
  }
  async function handleUpdateRamen(updatedData) {
    await room.collection("ramen").upsert({
      id: editingRamen.id,
      ...updatedData
    });
    setEditingRamen(null);
  }
  async function createRamen() {
    const name = prompt("Name your ramen creation:");
    const description = prompt("Describe your ramen:");
    const ingredients = prompt("List ingredients (comma separated):").split(",").map((i) => i.trim());
    if (!name || !description) return;
    const promptText = `A beautiful bowl of ${name} ramen with ${ingredients.join(", ")}, professional food photography, steam rising, appetizing, Japanese cuisine, high quality`;
    const image = await websim.imageGen({
      prompt: promptText,
      aspect_ratio: "1:1"
    });
    await room.collection("ramen").create({
      name,
      description,
      image_url: image.url,
      ingredients,
      featured: false,
      featured_reason: null,
      featured_amount: 0
    });
  }
  if (loading) return /* @__PURE__ */ jsxDEV("div", { className: "text-center py-10", children: "Loading ramen..." }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 161,
    columnNumber: 25
  }, this);
  return /* @__PURE__ */ jsxDEV("div", { className: "container mx-auto px-4 py-8", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "text-center mb-8", children: [
      /* @__PURE__ */ jsxDEV("h1", { className: "text-5xl font-bold text-orange-400 mb-4", children: "\u{1F35C} Infinite Ramen AI" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 166,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV("p", { className: "text-gray-300 mb-6", children: "Generate, share, and compete with AI-created ramen masterpieces!" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 167,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "flex justify-center space-x-4 mb-8", children: [
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: createRamen,
            className: "bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-lg font-bold transition-colors",
            children: "Generate New Ramen"
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 170,
            columnNumber: 21
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: () => window.websim.postComment({
              content: "Tip to feature your favorite ramen creations!"
            }),
            className: "bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-6 py-3 rounded-lg font-bold transition-colors",
            children: "\u{1F4B0} Tip to Feature"
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 177,
            columnNumber: 21
          },
          this
        )
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 169,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 165,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: sortedRamen?.map((ramen) => /* @__PURE__ */ jsxDEV(
      RamenCard,
      {
        ramen,
        spoonsCount: getSpoonCount(ramen.id),
        onSpoon: handleSpoon,
        onEdit: handleEdit,
        onDelete: handleDelete,
        isOwner: currentUser && ramen.username === currentUser.username
      },
      ramen.id,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 190,
        columnNumber: 21
      },
      this
    )) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 188,
      columnNumber: 13
    }, this),
    ramenList?.length === 0 && /* @__PURE__ */ jsxDEV("div", { className: "text-center py-20", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "text-6xl mb-4", children: "\u{1F35C}" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 204,
        columnNumber: 21
      }, this),
      /* @__PURE__ */ jsxDEV("p", { className: "text-gray-400", children: "No ramen creations yet. Be the first!" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 205,
        columnNumber: 21
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 203,
      columnNumber: 17
    }, this),
    editingRamen && /* @__PURE__ */ jsxDEV("div", { className: "fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50", children: /* @__PURE__ */ jsxDEV("div", { className: "bg-gray-800 p-6 rounded-lg w-full max-w-md", children: [
      /* @__PURE__ */ jsxDEV("h2", { className: "text-2xl font-bold text-orange-400 mb-4", children: "Edit Ramen" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 212,
        columnNumber: 25
      }, this),
      /* @__PURE__ */ jsxDEV("form", { onSubmit: (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        handleUpdateRamen({
          name: formData.get("name"),
          description: formData.get("description"),
          ingredients: formData.get("ingredients").split(",").map((i) => i.trim())
        });
      }, children: [
        /* @__PURE__ */ jsxDEV("div", { className: "mb-4", children: [
          /* @__PURE__ */ jsxDEV("label", { className: "block text-sm font-medium mb-2", children: "Name" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 223,
            columnNumber: 33
          }, this),
          /* @__PURE__ */ jsxDEV(
            "input",
            {
              name: "name",
              type: "text",
              defaultValue: editingRamen.name,
              className: "w-full px-3 py-2 bg-gray-700 rounded-md",
              required: true
            },
            void 0,
            false,
            {
              fileName: "<stdin>",
              lineNumber: 224,
              columnNumber: 33
            },
            this
          )
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 222,
          columnNumber: 29
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "mb-4", children: [
          /* @__PURE__ */ jsxDEV("label", { className: "block text-sm font-medium mb-2", children: "Description" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 233,
            columnNumber: 33
          }, this),
          /* @__PURE__ */ jsxDEV(
            "textarea",
            {
              name: "description",
              defaultValue: editingRamen.description,
              className: "w-full px-3 py-2 bg-gray-700 rounded-md",
              rows: "3",
              required: true
            },
            void 0,
            false,
            {
              fileName: "<stdin>",
              lineNumber: 234,
              columnNumber: 33
            },
            this
          )
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 232,
          columnNumber: 29
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "mb-4", children: [
          /* @__PURE__ */ jsxDEV("label", { className: "block text-sm font-medium mb-2", children: "Ingredients (comma separated)" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 243,
            columnNumber: 33
          }, this),
          /* @__PURE__ */ jsxDEV(
            "input",
            {
              name: "ingredients",
              type: "text",
              defaultValue: editingRamen.ingredients?.join(", "),
              className: "w-full px-3 py-2 bg-gray-700 rounded-md"
            },
            void 0,
            false,
            {
              fileName: "<stdin>",
              lineNumber: 244,
              columnNumber: 33
            },
            this
          )
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 242,
          columnNumber: 29
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "flex space-x-4", children: [
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              type: "submit",
              className: "bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-md",
              children: "Save Changes"
            },
            void 0,
            false,
            {
              fileName: "<stdin>",
              lineNumber: 252,
              columnNumber: 33
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              type: "button",
              onClick: () => setEditingRamen(null),
              className: "bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-md",
              children: "Cancel"
            },
            void 0,
            false,
            {
              fileName: "<stdin>",
              lineNumber: 258,
              columnNumber: 33
            },
            this
          )
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 251,
          columnNumber: 29
        }, this)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 213,
        columnNumber: 25
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 211,
      columnNumber: 21
    }, this) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 210,
      columnNumber: 17
    }, this)
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 164,
    columnNumber: 9
  }, this);
}
const root = createRoot(document.getElementById("root"));
root.render(/* @__PURE__ */ jsxDEV(Leaderboard, {}, void 0, false, {
  fileName: "<stdin>",
  lineNumber: 275,
  columnNumber: 13
}));
