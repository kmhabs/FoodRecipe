import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    StyleSheet,
    ActivityIndicator,
  } from "react-native";
  import React, { useEffect, useState } from "react";
  import AsyncStorage from "@react-native-async-storage/async-storage";
  import { useNavigation } from "@react-navigation/native";
  import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from "react-native-responsive-screen";
import { useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { toggleFavorite } from "../redux/favoritesSlice";
import Categories from "../components/categories";
import FoodItems from "../components/recipes";

  export default function MyRecipeScreen() {
      const navigation = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute();
  const { recipe } = route.params || {}; 
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const favoriteRecipe = useSelector((state) => state.favorites.favoriterecipes);
  const isFavourite = favoriteRecipe.some(fav => fav.title === recipe.title);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const storedRecipes = await AsyncStorage.getItem("customrecipes");
        if (storedRecipes) {
          setRecipes(JSON.parse(storedRecipes));
        }
      } catch (error) {
        console.error("Error fetching recipes", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  if (!recipe) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>No Recipe Details Available</Text>
      </View>
    );
  }

  const handleToggleFavorite = () => {
    dispatch(toggleFavorite(recipe));
  };

  const handleAddRecipe = () => {
    navigation.navigate("RecipesFormScreen");
  };

  const handleRecipeClick = (recipe) => {
    navigation.navigate("CustomRecipesScreen", { recipe });
  };

  const deleteRecipe = async (index) => {
    try {
      let updatedRecipes = [...recipes];
      updatedRecipes.splice(index, 1);
      await AsyncStorage.setItem("customrecipes", JSON.stringify(updatedRecipes));
      setRecipes(updatedRecipes);
    } catch (error) {
      console.error("Error deleting recipe", error);
    }
  };

  const editRecipe = (recipe, index) => {
    navigation.navigate("RecipesFormScreen", { recipeToEdit: recipe, recipeIndex: index });
  };
  
    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent} testID="scrollContent">
        <View style={styles.imageContainer} testID="imageContainer">
          {recipe.image && <Image source={{ uri: recipe.image }} style={styles.recipeImage} />}
        </View>
        
        <View style={styles.topButtonsContainer} testID="topButtonsContainer">
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleToggleFavorite} style={styles.favoriteButton}>
            <Text>{isFavourite ? "♥" : "♡"}</Text>
          </TouchableOpacity>
        </View>
  
        <View style={styles.contentContainer} testID="contentContainer">
          <Text style={styles.recipeTitle}>{recipe.title}</Text>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Content</Text>
            <Text style={styles.contentText}>{recipe.description}</Text>
          </View>
        </View>
  
        <TouchableOpacity onPress={handleAddRecipe} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add New Recipe</Text>
        </TouchableOpacity>
  
        {loading ? (
          <ActivityIndicator size="large" color="#f59e0b" />
        ) : (
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {recipes.length === 0 ? (
              <Text style={styles.noRecipesText}>No recipes added yet.</Text>
            ) : (
              recipes.map((recipe, index) => (
                <View key={index} style={styles.recipeCard} testID="recipeCard">
                  <TouchableOpacity testID="handleRecipeBtn" onPress={() => handleRecipeClick(recipe)}>
                    <Text style={styles.recipeTitle}>{recipe.title}</Text>
                    <Text style={styles.recipeDescription} testID="recipeDescp">
                      {recipe.description.length > 50 ? `${recipe.description.substring(0, 50)}...` : recipe.description}
                    </Text>
                  </TouchableOpacity>
                  <View style={styles.actionButtonsContainer} testID="editDeleteButtons">
                    <TouchableOpacity onPress={() => editRecipe(recipe, index)} style={styles.editButton}>
                      <Text style={styles.editButtonText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => deleteRecipe(index)} style={styles.deleteButton}>
                      <Text style={styles.deleteButtonText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        )}
      </ScrollView>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: wp(4),
      backgroundColor: "#F9FAFB",
    },
    backButton: {
      marginBottom: hp(1.5),
    },
    backButtonText: {
      fontSize: hp(2.2),
      color: "#4F75FF",
    },
    addButton: {
      backgroundColor: "#4F75FF",
      padding: wp(.7),
      alignItems: "center",
      borderRadius: 5,
      width:300,
     marginLeft:500
      // marginBottom: hp(2),
    },
    addButtonText: {
      color: "#fff",
      fontWeight: "600",
      fontSize: hp(2.2),
    },
    scrollContainer: {
      paddingBottom: hp(2),
      height:'auto',
      display:'flex',
      alignItems:'center',
      justifyContent:'center',
      flexDirection:'row',
      flexWrap:'wrap'
    },
    norecipesText: {
      textAlign: "center",
      fontSize: hp(2),
      color: "#6B7280",
      marginTop: hp(5),
    },
    recipeCard: {
      width: 400, // Make recipe card width more compact
      height: 300, // Adjust the height of the card to fit content
      backgroundColor: "#fff",
      padding: wp(3),
      borderRadius: 8,
      marginBottom: hp(2),
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      elevation: 3, // for Android shadow
    },
    recipeImage: {
      width: 300, // Set width for recipe image
      height: 150, // Adjust height of the image
      borderRadius: 8,
      marginBottom: hp(1),
    },
    recipeTitle: {
      fontSize: hp(2),
      fontWeight: "600",
      color: "#111827",
      marginBottom: hp(0.5),
    },
    recipeDescription: {
      fontSize: hp(1.8),
      color: "#6B7280",
      marginBottom: hp(1.5),
    },
    actionButtonsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: hp(1),
    },
    editButton: {
      backgroundColor: "#34D399",
      padding: wp(.5),
      borderRadius: 5,
      width: 100, // Adjust width of buttons to be more compact
      alignItems: "center",
    },
    editButtonText: {
      color: "#fff",
      fontWeight: "600",
      fontSize: hp(1.8),
    },
    deleteButton: {
      backgroundColor: "#EF4444",
      padding: wp(.5),
      borderRadius: 5,
      width: 100, // Adjust width of buttons to be more compact
      alignItems: "center",
    },
    deleteButtonText: {
      color: "#fff",
      fontWeight: "600",
      fontSize: hp(1.8),
    },
  });
  