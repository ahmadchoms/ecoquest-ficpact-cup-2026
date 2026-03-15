import CarbonCalculator from "@/components/mission/missions/CarbonCalculator";
import WasteSorting from "@/components/mission/missions/WasteSorting";
import SpeciesQuiz from "@/components/mission/missions/SpeciesQuiz";
import MangroveSimulator from "@/components/mission/missions/MangroveSimulator";
import WaterConservation from "@/components/mission/missions/WaterConservation";
import OceanRescue from "@/components/mission/missions/OceanRescue";
import EcoRoute from "@/components/mission/missions/EcoRoute";

const missionComponents = {
  CLIMATE: CarbonCalculator,
  WASTE: WasteSorting,
  BIODIVERSITY: SpeciesQuiz,
  COASTAL: MangroveSimulator,
  WATER: WaterConservation,
  OCEAN: OceanRescue,
  TRANSPORT: EcoRoute,
};

export default missionComponents;
