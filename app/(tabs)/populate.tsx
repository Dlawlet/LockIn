import { db } from "@/config/firebase";
import { useThemeColor } from "@/hooks/useThemeColor";
import { addDoc, collection } from "firebase/firestore";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const BLOG_ARTICLES = [
  {
    title:
      "7 stratégies scientifiques pour maintenir sa motivation sur 30 jours",
    content: `# Comment rester motivé pendant 30 jours : Les secrets de la science

La motivation est comme un muscle : elle se fatigue mais peut aussi se renforcer. Après avoir analysé plus de 100 études sur la psychologie comportementale, voici les 7 stratégies les plus efficaces pour maintenir votre élan sur le long terme.

## 1. La règle des 2 minutes

Commencez toujours par une version ultra-simplifiée de votre habitude. Voulez-vous faire 30 minutes de sport ? Commencez par 2 minutes. Cette technique, popularisée par James Clear, exploite notre tendance naturelle à continuer une action déjà commencée.

## 2. Le tracking visuel

Notre cerveau adore les récompenses visuelles. Utilisez un calendrier physique et barrez chaque jour réussi avec un marqueur rouge. Cette simple action libère de la dopamine et renforce le circuit de récompense.

## 3. L'accountability partner

Trouvez quelqu'un qui partage vos objectifs. Les études montrent que vous avez 65% de chances de réussir si vous vous engagez devant quelqu'un, et 95% si vous avez des rendez-vous réguliers de suivi.

## 4. La technique du "si alors"

Préparez votre cerveau aux obstacles : "Si je n'ai pas envie de faire mon exercice, alors je ferai au moins 5 pompes." Cette planification mentale augmente vos chances de succès de 300%.

## 5. Le reward stacking

Associez votre nouvelle habitude à quelque chose que vous aimez déjà. Écoutez votre podcast préféré uniquement pendant votre jogging, par exemple.

## 6. La visualisation du futur moi

Passez 5 minutes chaque matin à visualiser la personne que vous serez dans 30 jours. Rendez cette image aussi vivante que possible : que ressentez-vous ? Comment les autres vous voient-ils ?

## 7. L'auto-compassion

Soyez votre meilleur ami, pas votre pire critique. Les recherches de Kristin Neff montrent que l'auto-compassion est plus efficace que l'auto-discipline pour maintenir des changements durables.

## Le mot de la fin

La motivation n'est pas un trait de caractère, c'est une compétence qui s'apprend. Avec ces 7 stratégies, vous avez maintenant les outils pour transformer vos bonnes intentions en habitudes durables.

*Bonne chance dans votre parcours de transformation !*`,
    shortDescription:
      "Découvrez les 7 stratégies scientifiquement prouvées pour maintenir votre motivation pendant 30 jours. Des techniques concrètes basées sur plus de 100 études en psychologie comportementale.",
    category: "motivation",
    author: "Dr. Sarah Martinez",
    authorAvatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400",
    publishDate: "2024-01-15",
    readTime: "8 min",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    likes: 234,
    comments: 45,
    featured: true,
    tags: ["motivation", "psychologie", "habitudes", "science"],
  },
  {
    title: "L'art de transformer l'échec en tremplin vers le succès",
    content: `# Transformer l'échec en succès : Le mindset des champions

L'échec n'est pas l'opposé du succès, c'est un ingrédient essentiel. Voici comment les personnes qui réussissent transforment leurs échecs en opportunités d'apprentissage.

## Le mindset de croissance

Carol Dweck, psychologue à Stanford, a découvert que notre façon de percevoir l'échec détermine largement notre capacité à rebondir. Les personnes avec un "mindset de croissance" voient l'échec comme une information, pas comme une identité.

## La technique des 3 questions

Après chaque échec, posez-vous :
1. Qu'est-ce que j'ai appris ?
2. Qu'est-ce que je ferais différemment ?
3. Comment puis-je appliquer cette leçon maintenant ?

## L'effet post-traumatique positif

Contrairement à ce qu'on pourrait croire, traverser des difficultés peut nous rendre plus forts. Ce phénomène, appelé "croissance post-traumatique", montre que 70% des personnes ressortent grandies de leurs épreuves.

## La résilience comme super-pouvoir

La résilience n'est pas innée, elle se développe. Chaque fois que vous vous relevez, vous renforcez votre "muscle de la résilience" pour les défis futurs.

## Conclusion

L'échec n'est qu'un détour, pas une destination. Embrassez-le, apprenez-en, et utilisez-le comme carburant pour votre prochaine tentative.`,
    shortDescription:
      "Comment transformer vos échecs en opportunités d'apprentissage ? Découvrez les techniques utilisées par les champions pour rebondir plus fort après chaque difficultés.",
    category: "mindset",
    author: "Marc Dubois",
    authorAvatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
    publishDate: "2024-01-12",
    readTime: "6 min",
    image: "https://images.unsplash.com/photo-1515378791036-0648a814c963?w=800",
    likes: 189,
    comments: 32,
    featured: true,
    tags: ["mindset", "résilience", "échec", "croissance"],
  },
  {
    title: "5 habitudes matinales qui vont transformer votre journée",
    content: `# 5 habitudes matinales pour transformer votre vie

Vos premières heures déterminent votre journée entière. Voici 5 habitudes simples mais puissantes pour commencer chaque matin du bon pied.

## 1. L'hydratation immédiate

Buvez 500ml d'eau dès le réveil. Après 7-8h sans hydratation, votre corps en a besoin pour relancer son métabolisme et améliorer vos fonctions cognitives.

## 2. La gratitude en 3 points

Notez 3 choses pour lesquelles vous êtes reconnaissant. Cette pratique de 2 minutes rewire littéralement votre cerveau pour voir le positif en premier.

## 3. Le mouvement de 10 minutes

Pas besoin d'une séance de sport complète. 10 minutes d'étirements, de yoga ou de marche suffisent à activer votre circulation et libérer des endorphines.

## 4. La planification des 3 priorités

Identifiez les 3 tâches les plus importantes de votre journée. Cette clarté mentale vous évite de vous disperser et augmente votre sentiment d'accomplissement.

## 5. L'évitement des écrans pendant 1h

Donnez à votre cerveau le temps de se réveiller naturellement avant de l'bombarder d'informations. Cette pause numérique améliore votre focus pour toute la journée.

## Le défi 7 jours

Essayez ces 5 habitudes pendant une semaine. Vous serez surpris de l'impact sur votre énergie, votre humeur et votre productivité.`,
    shortDescription:
      "Transformez vos matins avec ces 5 habitudes simples mais puissantes. Des routines testées par des milliers de personnes pour commencer la journée avec énergie et clarté.",
    category: "productivite",
    author: "Emma Laurent",
    authorAvatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    publishDate: "2024-01-10",
    readTime: "5 min",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    likes: 156,
    comments: 28,
    featured: false,
    tags: ["routine", "matin", "productivité", "habitudes"],
  },
  {
    title:
      "Gérer le stress et l'anxiété : techniques validées scientifiquement",
    content: `# Vaincre le stress et l'anxiété : Les outils de la science

Le stress et l'anxiété touchent 8 personnes sur 10. Heureusement, la science nous offre des outils concrets pour reprendre le contrôle.

## La respiration 4-7-8

Cette technique de respiration, développée par le Dr. Andrew Weil, active instantanément votre système nerveux parasympathique :
- Inspirez pendant 4 secondes
- Retenez pendant 7 secondes  
- Expirez pendant 8 secondes
- Répétez 4 fois

## La méditation de pleine conscience

Seulement 10 minutes de méditation par jour réduisent le cortisol (hormone du stress) de 25%. Utilisez des apps comme Headspace ou Calm pour commencer.

## L'exercice physique comme antidépresseur naturel

30 minutes d'exercice modéré libèrent autant d'endorphines qu'un antidépresseur léger. La course, la natation ou même la marche rapide fonctionnent.

## La technique du "grounding" 5-4-3-2-1

En cas de crise d'anxiété, identifiez :
- 5 choses que vous voyez
- 4 choses que vous touchez
- 3 choses que vous entendez
- 2 choses que vous sentez
- 1 chose que vous goûtez

Cette technique ramène instantanément votre attention au présent.

## La restructuration cognitive

Remplacez "Et si tout va mal ?" par "Et si tout va bien ?". Ce simple changement de perspective peut transformer votre état d'esprit.

## Conclusion

Le stress n'est pas une fatalité. Avec ces outils, vous pouvez reprendre le contrôle de vos émotions et retrouver votre sérénité.`,
    shortDescription:
      "Stress et anxiété vous gâchent la vie ? Découvrez 5 techniques scientifiquement validées pour retrouver votre calme en quelques minutes. Des outils concrets et efficaces.",
    category: "bienetre",
    author: "Dr. Thomas Moreau",
    authorAvatar:
      "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400",
    publishDate: "2024-01-08",
    readTime: "7 min",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    likes: 198,
    comments: 41,
    featured: true,
    tags: ["stress", "anxiété", "méditation", "bien-être"],
  },
  {
    title: "Comment créer un environnement qui favorise vos bonnes habitudes",
    content: `# L'environnement : votre allié secret pour des habitudes durables

Votre environnement influence 45% de vos décisions quotidiennes. Voici comment le designer pour qu'il travaille pour vous, pas contre vous.

## La règle de l'évidence

Rendez vos bonnes habitudes évidentes :
- Laissez vos chaussures de sport près de votre lit
- Placez votre bouteille d'eau sur votre bureau
- Mettez votre livre sur votre oreiller

## La friction comme outil

Ajoutez de la friction aux mauvaises habitudes :
- Mettez votre téléphone dans une autre pièce
- Déconnectez votre télé après usage
- Cachez les snacks au fond du placard

## L'optimisation spatiale

Créez des "zones d'habitudes" :
- Un coin méditation avec coussin et bougie
- Un espace workout avec tapis et haltères
- Un bureau rangé pour la productivité

## Les rappels visuels

Utilisez des indices visuels :
- Post-it colorés pour vos objectifs
- Photos inspirantes sur votre miroir
- Calendrier de progression visible

## La règle des 20 secondes

Rendez vos bonnes habitudes 20 secondes plus faciles, et vos mauvaises habitudes 20 secondes plus difficiles. Cette petite différence change tout.

## Conclusion

Vous n'avez pas besoin de plus de volonté, vous avez besoin d'un meilleur design d'environnement. Changez votre espace, changez votre vie.`,
    shortDescription:
      "Votre environnement influence 45% de vos décisions. Apprenez à designer votre espace pour qu'il favorise automatiquement vos bonnes habitudes et élimine les tentations.",
    category: "habitudes",
    author: "Julie Petit",
    authorAvatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
    publishDate: "2024-01-05",
    readTime: "6 min",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800",
    likes: 143,
    comments: 25,
    featured: false,
    tags: ["environnement", "habitudes", "design", "organisation"],
  },
];

export default function PopulateBlogsPage() {
  const [loading, setLoading] = useState(false);
  const [populated, setPopulated] = useState(false);

  const tint = useThemeColor({}, "tint");
  const backgroundColor = useThemeColor({}, "background");
  const cardBackground = useThemeColor({}, "cardBackground");
  const textPrimary = useThemeColor({}, "text");
  const textSecondary = useThemeColor({}, "textSecondary");

  const populateBlogs = async () => {
    try {
      setLoading(true);

      const blogsCollection = collection(db, "blogs");

      // Add each article to Firestore
      for (const article of BLOG_ARTICLES) {
        await addDoc(blogsCollection, {
          ...article,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }

      setPopulated(true);
      Alert.alert(
        "Succès !",
        "5 articles de blog ont été ajoutés à votre collection Firestore.",
        [{ text: "OK" }]
      );
    } catch (error) {
      console.error("Error populating blogs:", error);
      Alert.alert(
        "Erreur",
        "Une erreur est survenue lors de l'ajout des articles.",
        [{ text: "OK" }]
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor }]}>
      <View style={[styles.card, { backgroundColor: cardBackground }]}>
        <Text style={[styles.title, { color: textPrimary }]}>
          Populate Blog Collection
        </Text>

        <Text style={[styles.description, { color: textSecondary }]}>
          Cette page va ajouter 5 articles de blog professionnels et réalistes à
          votre collection Firestore. Ces articles couvrent la motivation, le
          mindset, la productivité, le bien-être et les habitudes.
        </Text>

        <View style={styles.articlesList}>
          {BLOG_ARTICLES.map((article, index) => (
            <View
              key={index}
              style={[styles.articlePreview, { borderColor: tint + "30" }]}
            >
              <Text style={[styles.articleTitle, { color: textPrimary }]}>
                {article.title}
              </Text>
              <Text style={[styles.articleMeta, { color: textSecondary }]}>
                Par {article.author} • {article.category} • {article.readTime}
              </Text>
              <Text style={[styles.articleDesc, { color: textSecondary }]}>
                {article.shortDescription.substring(0, 100)}...
              </Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: populated ? "#10B981" : tint },
            loading && styles.buttonDisabled,
          ]}
          onPress={populateBlogs}
          disabled={loading || populated}
        >
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.buttonText}>
              {populated ? "✓ Articles ajoutés" : "Ajouter les 5 articles"}
            </Text>
          )}
        </TouchableOpacity>

        {populated && (
          <Text style={[styles.successText, { color: "#10B981" }]}>
            🎉 Parfait ! Vous pouvez maintenant retourner à la page Social pour
            voir vos articles.
          </Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  card: {
    padding: 24,
    borderRadius: 16,
    marginTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
    textAlign: "center",
  },
  articlesList: {
    marginBottom: 32,
  },
  articlePreview: {
    padding: 16,
    borderLeftWidth: 3,
    marginBottom: 16,
    borderRadius: 8,
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  articleMeta: {
    fontSize: 12,
    marginBottom: 8,
  },
  articleDesc: {
    fontSize: 14,
    lineHeight: 20,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  successText: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "500",
  },
});
