import {View,Text,ScrollView,TouchableOpacity,Image,StyleSheet,} from "react-native";
import React from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux"; // Redux hooks
import { toggleFavorite } from "../redux/favoritesSlice"; // Redux action

import { StatusBar } from "expo-status-bar";
import Categories from "../components/categories";
import FoodItems from "../components/recipes";

export default function RecipeDetailScreen(props) {
  const recipe = props.route.params; // recipe passed from previous screen

  const dispatch = useDispatch();
  const favoriterecipes = useSelector(
    (state) => state.favorites.favoriterecipes
  );
  const isFavourite = favoriterecipes?.some(
    (favrecipe) => favrecipe.idFood === recipe.idFood
  ); // Check by idrecipe

  const [activeCategory, setActiveCategory] = useState("Chicken");
    const navigation = useNavigation();

    const categories = [
        { idCategory: "1", strCategory: "Beef", strCategoryThumb: "https://www.themealdb.com/images/category/beef.png" },
        { idCategory: "2", strCategory: "Chicken", strCategoryThumb: "https://www.themealdb.com/images/category/chicken.png" },
        { idCategory: "3", strCategory: "Dessert", strCategoryThumb: "https://www.themealdb.com/images/category/dessert.png" },
    ];

    const allFood = [
        { category: 'Beef', idFood: '1', recipeName: "Beef and Mustard Pie", recipeImage: "https://images.unsplash.com/photo-1587248720327-8eb72564be1e?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", recipeInstructions: "Cook beef with mustard...", ingredients: [{ ingredientName: "Beef", measure: "1kg" }] },
        { category: 'Chicken', idFood: '7', recipeName: "Chicken Curry", recipeImage: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", recipeInstructions: "Cook chicken with spices...", ingredients: [{ ingredientName: "Chicken", measure: "500g" }] },
    ];

    const handleChangeCategory = (category) => {
        setActiveCategory(category);
    };

    const filteredfoods = allFood.filter((food) => food.category === activeCategory);

  const handleToggleFavorite = () => {
    dispatch(toggleFavorite(recipe)); // Dispatch the recipe to favorites
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.headerContainer} testID="headerContainer">
                    <Image source={{ uri: 'https://cdn.pixabay.com/photo/2017/02/23/13/05/avatar-2092113_1280.png' }} style={styles.avatar} />
                    <Text style={styles.greetingText}>Hello, User!</Text>
                </View>

                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Make your own food,</Text>
                    <Text style={styles.subtitle}>
                        stay at <Text style={styles.highlight}>home</Text>
                    </Text>
                </View>

                <View testID="categoryList">
                    <Categories categories={categories} activeCategory={activeCategory} handleChangeCategory={handleChangeCategory} />
                </View>

                <View testID="foodList">
                    <FlatList
                        data={filteredfoods}
                        keyExtractor={(item) => item.idFood}
                        numColumns={2}
                        renderItem={({ item, index }) => (
                            <TouchableOpacity
                                style={styles.cardContainer}
                                onPress={() => navigation.navigate("RecipeDetail", { recipe: item })}
                            >
                                <Image source={{ uri: item.recipeImage }} style={styles.articleImage} />
                                <Text style={styles.articleText}>{item.recipeName}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  imageContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  recipeImage: {
    width: wp(98),
    height: hp(40),
    borderRadius: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    marginTop: 4,
  },
  topButtonsContainer: {
    width: "100%",
    position: "absolute",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: hp(4),
  },
  backButton: {
    padding: 8,
    borderRadius: 50,
    marginLeft: wp(5),
    backgroundColor: "white",
  },
  favoriteButton: {
    padding: 8,
    borderRadius: 50,
    borderWidth: 1,
    marginRight: wp(5),
  },

  contentContainer: {
    paddingHorizontal: wp(4),
    paddingTop: hp(4),
  },
  recipeDetailsContainer: {
    marginBottom: hp(2),
  },
  recipeTitle: {
    fontSize: hp(3),
    fontWeight: "bold",
    color: "#4B5563", // text-neutral-700
  },
  recipeCategory: {
    fontSize: hp(2),
    fontWeight: "500",
    color: "#9CA3AF", // text-neutral-500
  },
  sectionContainer: {
    marginBottom: hp(2),
  },
  sectionTitle: {
    fontSize: hp(2.5),
    fontWeight: "bold",
    color: "#4B5563", // text-neutral-700
  },
  descriptionText: {
    fontSize: hp(1.8),
    color: "#4B5563", // text-neutral-700
    textAlign: "justify",
    lineHeight: hp(2.5),
  },
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  imageContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  recipeImage: {
    width: wp(98),
    height: hp(45),
    borderRadius: 20,
    marginTop: 4,
  },
  topButtonsContainer: {
    width: "100%",
    position: "absolute",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: hp(4),
  },
  backButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    marginLeft: wp(5),
  },
  backButtonText: {
    fontSize: hp(2),
    color: "#333",
    fontWeight: "bold",
  },
  favoriteButton: {
    padding: 10,
    borderRadius: 20,
    marginRight: wp(5),
  },
  favoriteButtonText: {
    fontSize: hp(2),
    color: "red",
  },
  mealName: {
    fontSize: hp(4),
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginVertical: 10,
    fontFamily: "Roboto",
  },
  mealCategory: {
    fontSize: hp(2),
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "Roboto",
  },
  miscContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
    paddingHorizontal: wp(4),
  },
  miscItem: {
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    elevation: 3,
  },
  miscIcon: {
    fontSize: hp(3.5),
    marginBottom: 5,
  },
  miscText: {
    fontSize: hp(2),
    fontWeight: "600",
    fontFamily: "Lato",
  },
  sectionContainer: {
    marginHorizontal: wp(5),
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: hp(2.8),
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    fontFamily: "Lato",
  },
  ingredientsList: {
    marginLeft: wp(4),
  },
  ingredientItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(1),
    padding: 10,
    backgroundColor: "#FFF9E1",
    borderRadius: 8,
    elevation: 2,
  },
  ingredientBullet: {
    backgroundColor: "#FFD700",
    borderRadius: 50,
    height: hp(1.5),
    width: hp(1.5),
    marginRight: wp(2),
  },
  ingredientText: {
    fontSize: hp(1.9),
    color: "#333",
    fontFamily: "Lato",
  },
  instructionsText: {
    fontSize: hp(2),
    color: "#444",
    lineHeight: hp(3),
    textAlign: "justify",
    fontFamily: "Lato",
  },
  videoLink: {
    fontSize: hp(2.2),
    color: "#1E90FF",
    textDecorationLine: "underline",
    marginTop: 10,
    fontFamily: "Roboto",
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  notFoundText: {
    fontSize: hp(3),
    fontWeight: "bold",
    color: "#D9534F",
  },
});
