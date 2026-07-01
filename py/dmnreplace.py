import xml.etree.ElementTree as ET

def strip_namespace_prefixes(elem):
    for el in elem.iter():
        if '}' in el.tag:
            el.tag = el.tag.split('}', 1)[1]  # strip namespace
        # Also clear attributes that might be namespaced
        el.attrib = {k.split('}', 1)[-1] if '}' in k else k: v for k, v in el.attrib.items()}


def replace_values_with_feel_expressions(file_path, decision_id, column_name):
    namespaces = {
        "dmn": "https://www.omg.org/spec/DMN/20191111/MODEL/"
    }

    tree = ET.parse(file_path)
    root = tree.getroot()

    decision = root.find(f".//dmn:decision[@id='{decision_id}']", namespaces)
    if decision is None:
        print(f"❌ No <decision> with id='{decision_id}' found.")
        return

    decision_table = decision.find("dmn:decisionTable", namespaces)
    if decision_table is None:
        print(f"❌ No <decisionTable> found inside decision id='{decision_id}'.")
        return

    # Locate column index
    inputs = decision_table.findall("dmn:input", namespaces)
    target_index = -1
    for idx, input_tag in enumerate(inputs):
        label = input_tag.attrib.get("label", "").strip()
        expr_tag = input_tag.find("dmn:inputExpression", namespaces)
        expr_text = expr_tag.find("dmn:text", namespaces).text.strip() if expr_tag is not None else ""
        if label == column_name or expr_text == column_name:
            target_index = idx
            break

    if target_index == -1:
        print(f"❌ Column '{column_name}' not found in decision '{decision_id}'.")
        return

    rules = decision_table.findall("dmn:rule", namespaces)
    changes = 0

    for rule in rules:
        input_entries = rule.findall("dmn:inputEntry", namespaces)
        if len(input_entries) <= target_index:
            continue

        text_tag = input_entries[target_index].find("dmn:text", namespaces)
        if text_tag is None or not text_tag.text:
            continue

        raw_value = text_tag.text.strip()

        # Remove quotes if wrapped
        if raw_value.startswith('"') and raw_value.endswith('"'):
            raw_value = raw_value[1:-1]

        values = [v.strip('" ').strip() for v in raw_value.split(",") if v.strip()]
        if not values:
            continue

        # Generate replacement FEEL expression
        if raw_value == "-" or raw_value.strip('" ') == "-":
            feel_expr = ""
        elif len(values) == 1:
            feel_expr = f'"{values[0]}" in {column_name}'
        else:
            formatted_list = ", ".join(f'"{v}"' for v in values)
            feel_expr = f'some x in {column_name} satisfies x in [{formatted_list}]'

        print(f"🔁 Replacing '{text_tag.text}' → '{feel_expr}'")
        text_tag.text = feel_expr
        changes += 1
    if changes > 0:
        tree.write(file_path, encoding="utf-8", xml_declaration=True)
        print(f"✅ {changes} value(s) replaced with FEEL expressions and saved to: {file_path}")
    else:
        print("ℹ️ No changes made.")

#replace_values_with_feel_expressions("usabilityRecommendationsForGamifiedSystemNaujausias.dmn", "Decision_15i8im0", "usabilityGoal")
#replace_values_with_feel_expressions("usabilityRecommendationsForGamifiedSystemNaujausias.dmn", "Decision_15i8im0", "usabilityPrinciple")
#replace_values_with_feel_expressions("usabilityRecommendationsForGamifiedSystemNaujausias.dmn", "Decision_15i8im0", "ageGroup")
#replace_values_with_feel_expressions("usabilityRecommendationsForGamifiedSystemNaujausias.dmn", "Decision_15i8im0", "applicationDomain")
#replace_values_with_feel_expressions("usabilityRecommendationsForGamifiedSystemNaujausias.dmn", "Decision_15i8im0", "disorder")
#replace_values_with_feel_expressions("usabilityRecommendationsForGamifiedSystemNaujausias.dmn", "Decision_15i8im0", "gamificationGoal")
#
## suitable gamification elements
#
#replace_values_with_feel_expressions("usabilityRecommendationsForGamifiedSystemNaujausias.dmn", "Decision_07k0rrh", "ageGroup")
#replace_values_with_feel_expressions("usabilityRecommendationsForGamifiedSystemNaujausias.dmn", "Decision_07k0rrh", "applicationDomain")
#replace_values_with_feel_expressions("usabilityRecommendationsForGamifiedSystemNaujausias.dmn", "Decision_07k0rrh", "disorder")
#replace_values_with_feel_expressions("usabilityRecommendationsForGamifiedSystemNaujausias.dmn", "Decision_07k0rrh", "gamificationGoal")
#replace_values_with_feel_expressions("usabilityRecommendationsForGamifiedSystemNaujausias.dmn", "Decision_07k0rrh", "usabilityGoal")
#replace_values_with_feel_expressions("usabilityRecommendationsForGamifiedSystemNaujausias.dmn", "Decision_07k0rrh", "usabilityCharacteristic")

#not suitable gamification elements

#replace_values_with_feel_expressions("usabilityRecommendationsForGamifiedSystemNaujausias.dmn", "Decision_1bxyvms", "ageGroup")
#replace_values_with_feel_expressions("usabilityRecommendationsForGamifiedSystemNaujausias.dmn", "Decision_1bxyvms", "applicationDomain")
#replace_values_with_feel_expressions("usabilityRecommendationsForGamifiedSystemNaujausias.dmn", "Decision_1bxyvms", "disorder")
#replace_values_with_feel_expressions("usabilityRecommendationsForGamifiedSystemNaujausias.dmn", "Decision_1bxyvms", "gamificationGoal")
#replace_values_with_feel_expressions("usabilityRecommendationsForGamifiedSystemNaujausias.dmn", "Decision_1bxyvms", "usabilityGoal")
#replace_values_with_feel_expressions("usabilityRecommendationsForGamifiedSystemNaujausias.dmn", "Decision_1bxyvms", "duration")

#usability recommendations for gamification elements

replace_values_with_feel_expressions("usabilityRecommendationsForGamifiedSystemNaujausias.dmn", "Decision_0tn6ter", "gamificationElement")
replace_values_with_feel_expressions("usabilityRecommendationsForGamifiedSystemNaujausias.dmn", "Decision_0j1rstw", "gamificationElement")
replace_values_with_feel_expressions("usabilityRecommendationsForGamifiedSystemNaujausias.dmn", "Decision_0j1rstw", "disorder")