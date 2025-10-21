"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import guideBook from "../../../public/assets/images/guideBook.jpg";
import { CertificationsSection } from "@/components/home/certifications";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";

const renderAlloyTable = (title, data, topHeader) => (
  <div className="space-y-4">
    <h3 className="text-xl font-semibold text-gray-900 capitalize">{title}</h3>
    <Table className="min-w-full divide-y divide-gray-200">
      <TableHeader className="bg-gray-50">
        {topHeader && (
          <TableRow>
            <TableHead colSpan={3} className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 px-6 py-3">
              {topHeader}
            </TableHead>
          </TableRow>
        )}
        <TableRow>
          <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Grade
          </TableHead>
          <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            UNS#
          </TableHead>
          <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Technical Data
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody className="bg-white divide-y divide-gray-200">
        {data.map((item, index) => (
          <TableRow key={index}>
            <TableCell className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
              {item.grade}
            </TableCell>
            <TableCell className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
              {item.uns}
            </TableCell>
            <TableCell className="px-3 py-4 whitespace-nowrap text-sm line-clamp-1">
              <a
                href={item.url}
                className="text-blue-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {item.technicalData}
              </a>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

export function ReferencesPage() {
  const alloyTables = [
    {
      grade: "Grade 1 CP 4",
      uns: "R50250",
      technicalData: "Titanium Grade 1 Technical Info",
      url: "https://titanium.com/alloys/titanium-and-titanium-alloys/grade-1-cp-4/",
    },
    {
      grade: "Grade 2 CP 3",
      uns: "R50400",
      technicalData: "Titanium Grade 2 Technical Info",
      url: "https://titanium.com/alloys/titanium-and-titanium-alloys/ti-grade-2-cp-3/",
    },
    {
      grade: "Grade 3 CP 2",
      uns: "R50550",
      technicalData: "Titanium Grade 3 Technical Info",
      url: "https://titanium.com/alloys/titanium-and-titanium-alloys/ti-grade-3-cp-2/",
    },
    {
      grade: "Grade 4 CP 1",
      uns: "R50700",
      technicalData: "Titanium Grade 4 Technical Info",
      url: "https://titanium.com/alloys/titanium-and-titanium-alloys/ti-grade-4-cp-1/",
    },
  ];

  const alloyTables2 = [
    {
      grade: "13-8 PH",
      uns: "S13800",
      technicalData: "Stainless Steel Grade 13-8 PH Technical Info",
      url: "https://titanium.com/alloys/stainless-steel/stainless-steel-13-8ph/",
    },
    {
      grade: "15-5 PH",
      uns: "S15500",
      technicalData: "Stainless Steel Grade 15-5 PH Technical Info",
      url: "https://titanium.com/alloys/stainless-steel/stainless-steel-15-5ph/",
    },
    {
      grade: "17-4 PH",
      uns: "S17400",
      technicalData: "Stainless Steel Grade 17-4 PH Technical Info",
      url: "https://titanium.com/alloys/stainless-steel/stainless-steel-17-4-ph/",
    },
    {
      grade: "17-7 PH",
      uns: "S17700",
      technicalData: "Stainless Steel Grade 17-7 PH Technical Info",
      url: "https://titanium.com/alloys/stainless-steel/stainless-steel-grade-17-7ph/",
    },
  ];

  const alloyTables3 = [
    {
      grade: "6Al-4V Grade 5",
      uns: "R56400",
      technicalData: "Titanium Grade 5 Technical Info",
      url: "https://titanium.com/alloys/titanium-and-titanium-alloys/ti-grade-5-6al-4v/",
    },
    {
      grade: "6Al-4V ELI Grade 23",
      uns: "R56401",
      technicalData: "Titanium Grade 23 Technical Info",
      url: "https://titanium.com/alloys/titanium-and-titanium-alloys/ti-grade-6al-4v-eli-grade-23/",
    },
    {
      grade: "6Al-6V-2SN",
      uns: "R56620",
      technicalData: "Titanium 6Al-6V-2Sn Technical Info",
      url: "https://titanium.com/alloys/titanium-and-titanium-alloys/ti-6al-6v-2sn/",
    },
    {
      grade: "6Al-2Sn-4Zr-2Mo",
      uns: "R54620",
      technicalData: "Titanium 6Al-2Sn-4Zr-2Mo Technical Info",
      url: "https://titanium.com/alloys/titanium-and-titanium-alloys/ti-6al-2sn-4zr-2mo/",
    },
    {
      grade: "6Al-2Sn-4Zr-6Mo",
      uns: "R56260",
      technicalData: "Titanium 6Al-2Sn-4Zr-6Mo Technical Info",
      url: "https://titanium.com/alloys/titanium-and-titanium-alloys/6al-2sn-4zr-6mo/",
    },
    {
      grade: "7Al-4Mo",
      uns: "R56740",
      technicalData: "Titanium 7Al-4Mo Technical Info",
      url: "https://titanium.com/alloys/titanium-and-titanium-alloys/7al-4mo/",
    },
    {
      grade: "Grade 7",
      uns: "R53400",
      technicalData: "Titanium Grade 7 Technical Info",
      url: "https://titanium.com/alloys/titanium-and-titanium-alloys/ti-grade-7/",
    },
    {
      grade: "Grade 12 0.8Ni-0.3Mo",
      uns: "R52400",
      technicalData: "Titanium Grade 12 Technical Info",
      url: "https://titanium.com/alloys/titanium-and-titanium-alloys/grade-12/",
    },
    {
      grade: "Grade 19 Ti BETA C™",
      uns: "R56407",
      technicalData: "Ti Beta C Grade 19 Technical Info",
      url: "http://titanium.com/alloys/titanium-and-titanium-alloys/ti-beta-c-grade-19/",
    },
    {
      grade: "15V-3Cr-3Sn-3Al",
      uns: "R58153",
      technicalData: "Ti Grade 15V-3Cr-3Al-3Sn Technical Info",
      url: "https://titanium.com/alloys/titanium-and-titanium-alloys/15v-3cr-3al-3sn/",
    },
  ];

  const alloyTables4 = [
    {
      grade: "108",
      uns: "S29108",
      technicalData: "Stainless Steel Grade 108 Technical Info",
      url: "https://titanium.com/alloys/stainless-steel/stainless-steel-grade-108/",
    },
    {
      grade: "301",
      uns: "S30100",
      technicalData: "Stainless Steel Grade 301 Technical Info",
      url: "https://titanium.com/alloys/stainless-steel/stainless-steel-grade-301/",
    },
    {
      grade: "302",
      uns: "S30200",
      technicalData: "Stainless Steel Grade 302 Technical Info",
      url: "https://titanium.com/alloys/stainless-steel/stainless-steel-grade-302/",
    },
    {
      grade: "303",
      uns: "S30300",
      technicalData: "Stainless Steel Grade 303 Technical Info",
      url: "https://titanium.com/alloys/stainless-steel/stainless-steel-grade-303/",
    },
    {
      grade: "303Se",
      uns: "S30323",
      technicalData: "Stainless Steel Grade 303Se Technical Info",
      url: "https://titanium.com/alloys/stainless-steel/stainless-steel-grade-303se/",
    },
    {
      grade: "304",
      uns: "S30400",
      technicalData: "Stainless Steel Grade 304 Technical Info",
      url: "https://titanium.com/alloys/stainless-steel/stainless-steel-grade-304/",
    },
    {
      grade: "304L",
      uns: "S30403",
      technicalData: "Stainless Steel Grade 304L Technical Info",
      url: "hhttps://titanium.com/alloys/stainless-steel/stainless-steel-grade-304l/",
    },
    {
      grade: "310",
      uns: "S31000",
      technicalData: "Stainless Steel Grade 310 Technical Info",
      url: "https://titanium.com/alloys/stainless-steel/stainless-steel-grade-310/",
    },
    {
      grade: "316",
      uns: "S31600",
      technicalData: "Stainless Steel Grade 316 Technical Info",
      url: "https://titanium.com/alloys/stainless-steel/stainless-steel-grade-316/",
    },
    {
      grade: "316L",
      uns: "S31603",
      technicalData: "Stainless Steel Grade 316L Technical Info",
      url: "https://titanium.com/alloys/stainless-steel/stainless-steel-grade-316l/",
    },
    {
      grade: "321",
      uns: "S32100",
      technicalData: "Stainless Steel Grade 321 Technical Info",
      url: "http://titanium.com/alloys/stainless-steel/stainless-steel-321/",
    },
    {
      grade: "347",
      uns: "S34700",
      technicalData: "Stainless Steel Grade 347 Technical Info",
      url: "https://titanium.com/alloys/stainless-steel/stainless-steel-grade-347/",
    },
    {
      grade: "355",
      uns: "S35500",
      technicalData: "Stainless Steel Grade 355 Technical Info",
      url: "https://titanium.com/alloys/stainless-steel/stainless-steel-grade-355/",
    },
  ];

  const alloyTables5 = [
    {
      grade: "600",
      uns: "N06600",
      technicalData: "Nickel Alloy 600 Technical Info",
      url: "https://titanium.com/alloys/nickel-alloys/nickel-inconel-600/",
    },
    {
      grade: "625",
      uns: "N06625",
      technicalData: "Nickel Alloy 625 Technical Info",
      url: "https://titanium.com/alloys/nickel-alloys/nickel-alloy-625/",
    },
    {
      grade: "718",
      uns: "N07718",
      technicalData: "Nickel Alloy 718 Technical Info",
      url: "https://titanium.com/alloys/nickel-alloys/alloy_718/",
    },
    {
      grade: "750",
      uns: "N07750",
      technicalData: "Inconel® X-750 Technical Info",
      url: "https://titanium.com/alloys/nickel-alloys/nickel-alloy-750/",
    },
    {
      grade: "Monel® K500",
      uns: "N05500",
      technicalData: "Monel® K500 Technical Info",
      url: "https://titanium.com/alloys/nickel-alloys/nickel-alloy-mondel-k500/",
    },
    {
      grade: "MP35N®",
      uns: "R30035",
      technicalData: "MP35N® Technical Info",
      url: "https://titanium.com/alloys/nickel-alloys/nickel-alloy-mp35n/",
    },
    {
      grade: "A-286",
      uns: "S66286",
      technicalData: "Incoloy Alloy A286 Technical Info",
      url: "https://titanium.com/alloys/stainless-steel/stainless-steel-incoloy-a286/",
    },
    {
      grade: "Waspaloy™",
      uns: "N07001",
      technicalData: "Waspaloy Technical Info",
      url: "https://titanium.com/alloys/nickel-alloys/nickel-alloy-waspaloy/",
    },
  ];

  const alloyTables6 = [
    {
      grade: "403",
      uns: "S40300",
      technicalData: "Stainless Steel Grade 403 Technical Info",
      url: "https://titanium.com/alloys/stainless-steel/stainless-steel-alloy-403/",
    },
    {
      grade: "410",
      uns: "41000",
      technicalData: "Stainless Steel Grade 410 Technical Info",
      url: "https://titanium.com/alloys/stainless-steel/stainless-steel-alloy-410/",
    },
    {
      grade: "416 HT",
      uns: "S41600",
      technicalData: "Stainless Steel Grade 416 HT Technical Info",
      url: "https://titanium.com/alloys/stainless-steel/stainless-steel-alloy-416ht/",
    },
    {
      grade: "418",
      uns: "S41800",
      technicalData: "Stainless Steel Grade 418 Technical Info",
      url: "https://titanium.com/alloys/stainless-steel/stainless-steel-alloy-418/",
    },
    {
      grade: "420",
      uns: "S42000",
      technicalData: "Stainless Steel Grade 420 Technical Info",
      url: "https://titanium.com/alloys/stainless-steel/stainless-steel-alloy-420/",
    },
    {
      grade: "422",
      uns: "S42200",
      technicalData: "Stainless Steel Grade 422 Technical Info",
      url: "https://titanium.com/alloys/stainless-steel/stainless-steel-alloy-422/",
    },
    {
      grade: "430",
      uns: "S43000",
      technicalData: "Stainless Steel Grade 430 Technical Info",
      url: "https://titanium.com/alloys/stainless-steel/stainless-steel-alloy-430/",
    },
    {
      grade: "430F",
      uns: "S43020",
      technicalData: "Stainless Steel Grade 430F Technical Info",
      url: "https://titanium.com/alloys/stainless-steel/stainless-steel-alloy-430f/",
    },
    {
      grade: "431",
      uns: "S43100",
      technicalData: "Stainless Steel Grade 431 Technical Info",
      url: "https://titanium.com/alloys/stainless-steel/stainless-steel-alloy-431-uns-s43100/",
    },
    {
      grade: "440A",
      uns: "S44002",
      technicalData: "Stainless Steel Grade 440A Technical Info",
      url: "https://titanium.com/alloys/stainless-steel/stainless-steel-alloy-440a-2/",
    },
    {
      grade: "440C",
      uns: "S44004",
      technicalData: "Stainless Steel Grade 440C Technical Info",
      url: "https://titanium.com/alloys/stainless-steel/stainless-steel-grade-440c/",
    },
    {
      grade: "Custom 455",
      uns: "S45500",
      technicalData: "Stainless Steel Custom 455 Technical Info",
      url: "https://titanium.com/alloys/stainless-steel/stainless-steel-custom-455/",
    },
    {
      grade: "Custom 465",
      uns: "S46500",
      technicalData: "Stainless Steel Custom 465 Technical Info",
      url: "https://titanium.com/alloys/stainless-steel/stainless-steel-custom-465/",
    },
    {
      grade: "A286",
      uns: "S66286",
      technicalData: "Incoloy Alloy A286 Technical Info",
      url: "https://titanium.com/alloys/stainless-steel/stainless-steel-incoloy-a286/",
    },
    {
      grade: "AerMet® 100",
      uns: "K92580",
      technicalData: "AerMet® 100 Technical Info",
      url: "https://titanium.com/alloys/stainless-steel/aermet-100/",
    },
  ];

  const alloyTables7 = [
    {
      grade: "135M Nitralloy",
      uns: "K24065",
      technicalData: "Nitralloy 135® Technical Info",
      url: "https://titanium.com/alloys/alloy-steels/alloy-steel-135m-nitralloy/",
    },
    {
      grade: "4130",
      uns: "G41300",
      technicalData: "Alloy Steel AISI 4130 Technical Info",
      url: "https://titanium.com/alloys/alloy-steels/alloy-steel-4130/",
    },
    {
      grade: "4140",
      uns: "G41400",
      technicalData: "Alloy Steel AISI 4140 Technical Info",
      url: "https://titanium.com/alloys/alloy-steels/alloy-steel-4140/",
    },
    {
      grade: "4330",
      uns: "K23080",
      technicalData: "Alloy Steel AISI 4330 Technical Info",
      url: "https://titanium.com/alloys/alloy-steels/alloy-steel-aisi-4330/",
    },
    {
      grade: "4340",
      uns: "G43400",
      technicalData: "Alloy Steel AISI 4340 Technical Info",
      url: "https://titanium.com/alloys/alloy-steels/alloy-steel-grade-4340/",
    },
    {
      grade: "4340 MOD 300M",
      uns: "K44220",
      technicalData: "Alloy Steel AISI 4340 MOD 300M Technical Info",
      url: "https://titanium.com/alloys/alloy-steels/alloy-steel-aisi-4340-mod-300m/",
    },
    {
      grade: "4340 VM",
      uns: "K44220",
      technicalData: "Alloy Steel AISI 4340 VM Technical Info",
      url: "https://titanium.com/alloys/alloy-steels/alloy-steel-aisi-4340-mod-300m/",
    },
    {
      grade: "4815",
      uns: "G48150",
      technicalData: "Alloy Steel AISI 4815 Technical Info",
      url: "https://titanium.com/alloys/alloy-steels/alloy-steel-aisi-4815/",
    },
    {
      grade: "6150",
      uns: "G61500",
      technicalData: "Alloy Steel AISI SAE 6150 Technical Info",
      url: "https://titanium.com/alloys/alloy-steels/alloy-steel-aisi-6150/",
    },
    {
      grade: "8740",
      uns: "G87400",
      technicalData: "Alloy Steel AISI 8740 Technical Info",
      url: "https://titanium.com/alloys/alloy-steels/alloy-steel-aisi-8740/",
    },
    {
      grade: "E9310",
      uns: "G93106",
      technicalData: "Alloy Steel AISI E9310 Technical Info",
      url: "https://titanium.com/alloys/alloy-steels/alloy-steel-aisi-e9310-2/",
    },
    {
      grade: "9313",
      uns: "G93106",
      technicalData: "Alloy Steel AISI E9313 Technical Info",
      url: "https://titanium.com/alloys/alloy-steels/alloy-steel-aisi-e9310-2/",
    },
    {
      grade: "AMS 6304 (17-22A)",
      uns: "K14675",
      technicalData: "AMS 6304 (17-22A) Technical Info",
      url: "https://titanium.com/alloys/alloy-steels/alloy-steel-6304-17-22a/",
    },
    {
      grade: "HP 9-4-30",
      uns: "K91283",
      technicalData: "Alloy Steel HP 9-4-30 Technical Info",
      url: "https://titanium.com/alloys/alloy-steels/alloy-steel-aisi-hp-9-4-30/",
    },
    {
      grade: "H-11",
      uns: "T20811",
      technicalData: "Alloy Steel AISI H-11 Technical Info",
      url: "https://titanium.com/alloys/alloy-steels/alloy-steel-aisi-sae-h-11/",
    },
    {
      grade: "52100",
      uns: "G52986",
      technicalData: "Alloy Steel 52100 Technical Info",
      url: "https://titanium.com/alloys/alloy-steels/alloy-steel-52100/",
    },
  ];

  const alloyTables8 = [
    {
      grade: "2014",
      uns: "A92014",
      technicalData: "Aluminum Alloy 2014 Technical Info",
      url: "https://titanium.com/alloys/aluminum-alloys/aluminum-alloy-2014/",
    },
    {
      grade: "2017",
      uns: "A92017",
      technicalData: "Aluminum Alloy 2017 Technical Info",
      url: "https://titanium.com/alloys/aluminum-alloys/aluminum-alloy-2017/",
    },
    {
      grade: "2024",
      uns: "A92024",
      technicalData: "Aluminum Alloy 2024 Technical Info",
      url: "https://titanium.com/alloys/aluminum-alloys/aluminum-alloy-2024/",
    },
    {
      grade: "6061",
      uns: "A96061",
      technicalData: "Aluminum Alloy 6061 Technical Info",
      url: "https://titanium.com/alloys/aluminum-alloys/aluminum-alloy-6061/",
    },
    {
      grade: "7050",
      uns: "A97050",
      technicalData: "Aluminum Alloy 7050 Technical Info",
      url: "https://titanium.com/alloys/aluminum-alloys/aluminum-alloy-7050/",
    },
    {
      grade: "7075",
      uns: "A97075",
      technicalData: "Aluminum Alloy 7075 Technical Info",
      url: "https://titanium.com/alloys/aluminum-alloys/aluminum-alloy-7075/",
    },
  ];

  const alloyTables9 = [
    {
      grade: "AISI 1018",
      uns: "G10180",
      technicalData: "Carbon Steel AISI 1018 Technical Info",
      url: "https://titanium.com/alloys/carbon-steels/carbon-steel-sae-aisi-1018/",
    },
    {
      grade: "AISI 1137",
      uns: "G11370",
      technicalData: "Carbon Steel AISI 1137 Technical Info",
      url: "https://titanium.com/alloys/carbon-steels/carbon-steel-aisi-1137/",
    },
    {
      grade: "AISI 1215",
      uns: "G12150",
      technicalData: "Carbon Steel AISI 1215 Technical Info",
      url: "https://titanium.com/alloys/carbon-steels/carbon-steel-aisi-1215/",
    },
    {
      grade: "AISI 12L14",
      uns: "G12144",
      technicalData: "Carbon Steel AISI 12L14 Technical Info",
      url: "https://titanium.com/alloys/carbon-steels/carbon-steel-aisi-12l14/",
    },
  ];

  return (
    <section className="pt-8">
      <div className="bg-gray-50">
        <div className="mx-auto container px-4 md:px-6 lg:px-8">
          <div className="w-full bg-gray-800 p-4 sm:p-5 text-white relative rounded-xl">
            <h1 className="text-blue-400 text-lg sm:text-xl font-semibold mb-0">
              Titanium Industries{" "}
              <span className="text-white">| Technical References</span>{" "}
            </h1>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 my-4 sm:my-6 px-4">
            <Link href={"/contact"}>
              <Button>Contact Us</Button>
            </Link>
            <Link href={"/customer/quick-quote"}>
              <Button>Create Quote</Button>
            </Link>
            <Link href={"/tools/calculator"}>
              <Button>Shop</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-3 sm:py-6">
            <div className="col-span-2">
              <p className="mt-0 sm:mt-4 text-sm md:text-base lg:text-lg text-gray-600">
                Titanium Industries can provide technical information and
                assistance on all products and services offered.
              </p>
              <h2 className="text-xl lg:text-3xl mt-3 font-semibold tracking-tight text-gray-900 sm:text-4xl">
                Specialty Metals Technical Reference Library
              </h2>
              <p className="mt-4 text-sm md:text-base lg:text-lg text-gray-600">
                Welcome to Titanium Industries’{" "}
                <span className="text-blue-600 font-medium">
                  Specialty Metals Technical Reference Library
                </span>{" "}
                — your source for accurate, up-to-date{" "}
                <span className="text-blue-600 font-medium">
                  metal alloy technical data
                </span>
                and specifications. This library includes detailed reference
                information for{" "}
                <span className="text-blue-600 font-medium">
                  titanium, nickel alloys, cobalt chrome, stainless steel, alloy
                  steel, carbon steel,{" "}
                </span>{" "}
                and{" "}
                <span className="text-blue-600 font-medium">
                  aluminum alloys
                </span>
                , covering <span>UNS designations, mechanical properties</span>,
                and <span>chemical compositions</span> across dozens of grades.
              </p>
              <p className="mt-4 text-sm md:text-base lg:text-lg text-gray-600">
                Whether you’re sourcing for aerospace, medical, industrial, or
                oil and gas applications, these datasheets support engineering
                review and material comparison.
              </p>
              <p className="mt-4 text-sm md:text-base lg:text-lg text-gray-600">
                <span className="text-blue-600 font-medium">⚠️ DISCLAIMER</span>
                : Alloy data sheets are for reference only and{" "}
                <span className="text-blue-600 font-medium">
                  are not intended for design purposes
                </span>
                . Please contact us directly for certified data or documentation
                to support your specific requirements.
              </p>
            </div>
            <div className="col-span-1 flex flex-col items-center justify-center">
              <Image
                src={guideBook}
                alt="Guide Book"
                className="w-[140px] h-[190px] sm:w-[200px] sm:h-[300px]"
              />
              <p className="text-center mt-4 text-sm md:text-base lg:text-lg text-blue-600 font-regular hover:underline cursor-pointer">
                Alloy Datasheet Guidebook – 2018
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 items-start">
            <div className="col-span-2 md:col-span-1 space-y-4">
              <div className="bg-white rounded-lg shadow-sm p-8">
                {renderAlloyTable("commercially Pure Titanium", alloyTables)}
              </div>
              <div className="bg-white rounded-lg shadow-sm p-8">
                {renderAlloyTable("Titanium Alloys", alloyTables3)}
              </div>
              <div className="bg-white rounded-lg shadow-sm p-8">
                {renderAlloyTable("Nickel Alloys", alloyTables5)}
              </div>
              <div className="bg-white rounded-lg shadow-sm p-8">
                {renderAlloyTable("Alloy Steels", alloyTables7)}
              </div>
              <div className="bg-white rounded-lg shadow-sm p-8">
                {renderAlloyTable("Carbon Steels", alloyTables9)}
              </div>
            </div>
            <div className="col-span-2 md:col-span-1 space-y-4">
              <div className="bg-white rounded-lg shadow-sm p-8">
                {renderAlloyTable("Stainless Steels", alloyTables2)}
              </div>
              <div className="bg-white rounded-lg shadow-sm p-8">
                {renderAlloyTable(
                  "",
                  alloyTables4,
                  "Austenitic alloys | 100, 200, & 300 Series"
                )}
              </div>
              <div className="bg-white rounded-lg shadow-sm p-8">
                {renderAlloyTable(
                  "",
                  alloyTables6,
                  "Ferritic & Martensitic alloys | 400 Series"
                )}
              </div>
              <div className="bg-white rounded-lg shadow-sm p-8">
                {renderAlloyTable("Aluminum Alloys", alloyTables8)}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16">
          <CertificationsSection />
        </div>
      </div>
      <div className="bg-gray-50 py-3 md:py-5 lg:border-t lg:border-b lg:border-blue-600">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 lg:gap-8 relative">
            {/* Vertical divider - only visible on large screens */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-blue-600 transform -translate-x-1/2"></div>

            {/* Mill Products Column */}
            <div className="md:p-4 rounded-lg">
              <h2 className="font-semibold text-blue-600 mb-3 sm:mb-4">
                Mill Products
              </h2>
              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                <div className="space-y-3">
                  <Link
                    href="#"
                    className="block text-blue-600 hover:text-blue-700 text-sm lg:text-base transition-colors"
                  >
                    Round Bar
                  </Link>
                  <Link
                    href="#"
                    className="block text-blue-600 hover:text-blue-700 text-sm lg:text-base transition-colors"
                  >
                    Titanium Hex Bar
                  </Link>
                  <Link
                    href="#"
                    className="block text-blue-600 hover:text-blue-700 text-sm lg:text-base transition-colors"
                  >
                    Billet
                  </Link>
                  <Link
                    href="#"
                    className="block text-blue-600 hover:text-blue-700 text-sm lg:text-base transition-colors"
                  >
                    Titanium Plate
                  </Link>
                  <Link
                    href="#"
                    className="block text-blue-600 hover:text-blue-700 text-sm lg:text-base transition-colors"
                  >
                    Expanded Metal
                  </Link>
                  <Link
                    href="#"
                    className="block text-blue-600 hover:text-blue-700 text-sm lg:text-base transition-colors"
                  >
                    Coil
                  </Link>
                </div>
                <div className="space-y-3">
                  <Link
                    href="#"
                    className="block text-blue-600 hover:text-blue-700 text-sm lg:text-base transition-colors"
                  >
                    Rectangle Bar
                  </Link>
                  <Link
                    href="#"
                    className="block text-blue-600 hover:text-blue-700 text-sm lg:text-base transition-colors"
                  >
                    Hollow Bar
                  </Link>
                  <Link
                    href="#"
                    className="block text-blue-600 hover:text-blue-700 text-sm lg:text-base transition-colors"
                  >
                    Titanium Block
                  </Link>
                  <Link
                    href="#"
                    className="block text-blue-600 hover:text-blue-700 text-sm lg:text-base transition-colors"
                  >
                    Titanium Sheet
                  </Link>
                  <Link
                    href="#"
                    className="block text-blue-600 hover:text-blue-700 text-sm lg:text-base transition-colors"
                  >
                    Titanium Wire
                  </Link>
                </div>
              </div>
            </div>

            <div className="md:p-4 rounded-lg">
              <h2 className="font-semibold text-blue-600 mb-3 sm:mb-4">
                Pipe & Fittings
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Link
                    href="#"
                    className="block text-blue-600 hover:text-blue-700 text-sm lg:text-base transition-colors"
                  >
                    Titanium Seamless Pipe
                  </Link>
                  <Link
                    href="#"
                    className="block text-blue-600 hover:text-blue-700 text-sm lg:text-base transition-colors"
                  >
                    Titanium Seamless Tube
                  </Link>
                  <Link
                    href="#"
                    className="block text-blue-600 hover:text-blue-700 text-sm lg:text-base transition-colors"
                  >
                    Titanium Concentric Reducers
                  </Link>
                  <Link
                    href="#"
                    className="block text-blue-600 hover:text-blue-700 text-sm lg:text-base transition-colors"
                  >
                    Titanium Elbows 45° & 90°
                  </Link>
                  <Link
                    href="#"
                    className="block text-blue-600 hover:text-blue-700 text-sm lg:text-base transition-colors"
                  >
                    Titanium Stub Ends
                  </Link>
                </div>
                <div className="space-y-3">
                  <Link
                    href="#"
                    className="block text-blue-600 hover:text-blue-700 text-sm lg:text-base transition-colors"
                  >
                    Titanium Welded Pipe
                  </Link>
                  <Link
                    href="#"
                    className="block text-blue-600 hover:text-blue-700 text-sm lg:text-base transition-colors"
                  >
                    Titanium Welded Tube
                  </Link>
                  <Link
                    href="#"
                    className="block text-blue-600 hover:text-blue-700 text-sm lg:text-base transition-colors"
                  >
                    Titanium Grade 2 Eccentric Reducers
                  </Link>
                  <Link
                    href="#"
                    className="block text-blue-600 hover:text-blue-700 text-sm lg:text-base transition-colors"
                  >
                    Titanium Flanges
                  </Link>
                  <Link
                    href="#"
                    className="block text-blue-600 hover:text-blue-700 text-sm lg:text-base transition-colors"
                  >
                    Grade 2 Titanium Straight Tee
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
